/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 1:25:38
 * enjoy springsprout ! development!
 */
package springsprout.m31.common.web;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * AJAX 요청시 권한 관련 오류가 생기면 redirect 시키는데,
 * AJAX는 HTTP 상태 코드를 이용해서 에러를 확인해야 하므로,
 * redirect 되기전에 상태 코드를 전송하게함.
 *
 * @author Miracle
 *
 */
public class AjaxSessionTimeoutFilter implements Filter {

	/**
	 * Default AJAX request Header
	 */
	private String ajaxHaeder = "AJAX";

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
	    HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        //AJAX 요청인가요?
        if(req.getHeader(ajaxHaeder) != null && req.getHeader(ajaxHaeder).equals("true")) {

                try {
                	chain.doFilter(req, res);
                } catch (AccessDeniedException e) {
                        res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                } catch (AuthenticationException e) {
                        res.sendError(HttpServletResponse.SC_FORBIDDEN);
                }
        } else
        	chain.doFilter(req, res);
	}


	public void init(FilterConfig filterConfig) throws ServletException {}

	/**
	 * Set AJAX Request Header (Default is AJAX)
	 * @param ajaxHeader
	 */
	public void setAjaxHaeder(String ajaxHeader) {
		this.ajaxHaeder = ajaxHeader;
	}
}
