/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 8:04:24
 * enjoy springsprout ! development!
 */
package springsprout.m31comet.module.comet;

import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import springsprout.m31comet.view.JacksonJsonView;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

public class M31CometServlet extends HttpServlet {

    Logger log = LoggerFactory.getLogger(getClass());
    ConcurrentHashMap<String, Continuation> store = new ConcurrentHashMap<String, Continuation>();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res) {
        String sessionId = req.getParameter("sessionId");
        JacksonJsonView jsonview = WebApplicationContextUtils.getWebApplicationContext(getServletContext()).getBean(JacksonJsonView.class);
        HashMap<String, Object> model = new HashMap<String, Object>();

        ApplicationContext m31App = (ApplicationContext)getServletContext().getAttribute("AC");
        log.debug(m31App.toString());
        if(req.getParameter("cmd").equals("wait")){
            Continuation continuation = ContinuationSupport.getContinuation(req);
            continuation.setTimeout(20000);

            log.debug("request stat >> "+new Date().toString());
            if(continuation.isInitial()){
                log.debug("init date>> " + new Date().toString());
                store.put(sessionId, continuation);
                continuation.suspend();
            }else{
                log.debug("espire date>> " + new Date().toString());
                model.put("result","expire!!");
                jsonview.render(model, req, res);
            }
        }else{
            store.get(sessionId).resume();
            store.remove(sessionId);
            model.put("resume",sessionId);
            jsonview.render(model, req, res);
        }
    }
}
