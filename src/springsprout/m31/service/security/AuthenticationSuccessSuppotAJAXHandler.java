package springsprout.m31.service.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationTargetUrlRequestHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.util.RedirectUtils;
import org.springframework.util.ReflectionUtils;
import org.springframework.util.StringUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Method;

public class AuthenticationSuccessSuppotAJAXHandler extends AbstractAuthenticationTargetUrlRequestHandler implements AuthenticationSuccessHandler {

	Logger log = LoggerFactory.getLogger(getClass());

    private RequestCache requestCache = new HttpSessionRequestCache();
    private String ajaxHeaderName = "AJAX";

    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {
        SavedRequest savedRequest = requestCache.getRequest(request, response);
        log.debug("passwd!!>>"+authentication.getCredentials());
        if (savedRequest == null) {
        	handle(request, response, authentication);
            return;
        }

        if (isAlwaysUseDefaultTargetUrl() || StringUtils.hasText(request.getParameter(getTargetUrlParameter())) || isAjaxLogin(request)) {
            requestCache.removeRequest(request, response);
            handle(request, response, authentication);

            return;
        }

        // Use the SavedRequest URL
        String targetUrl = savedRequest.getFullRequestUrl();
        logger.debug("Redirecting to SavedRequest Url: " + targetUrl);
        RedirectUtils.sendRedirect(request, response, targetUrl, isUseRelativeContext());
    }

    public void setRequestCache(RequestCache requestCache) {
        this.requestCache = requestCache;
    }

    public void setAjaxHeaderName(String ajaxHeaderName) {
		this.ajaxHeaderName = ajaxHeaderName;
	}

	public String getAjaxHeaderName() {
		return ajaxHeaderName;
	}

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
    throws IOException, ServletException {
    	Method mt  = ReflectionUtils.findMethod(AbstractAuthenticationTargetUrlRequestHandler.class, "determineTargetUrl",HttpServletRequest.class,HttpServletResponse.class);
    	ReflectionUtils.makeAccessible(mt);

    	String targetUrl = (String) ReflectionUtils.invokeMethod(mt, this, request,response);
    	logger.debug("isAjaxLogin [" + isAjaxLogin(request)+"]");
    	if (isAjaxLogin(request)) {
            request.getRequestDispatcher(targetUrl).forward(request, response);
        } else {
            RedirectUtils.sendRedirect(request, response, targetUrl, isUseRelativeContext());
        }
    }

    private boolean isAjaxLogin(HttpServletRequest req) {
    	return (req.getHeader(ajaxHeaderName) != null && req.getHeader(ajaxHeaderName).equals("true"));
    }
}
