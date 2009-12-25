/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 2:36:33
 * enjoy springsprout ! development!
 */
package springsprout.m31comet.module.comet;

import org.eclipse.jetty.continuation.Continuation;
import org.eclipse.jetty.continuation.ContinuationSupport;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
public class M31CometController {

    public ModelAndView service(HttpServletRequest req, HttpServletResponse res)
    {

        String reqId = req.getParameter("id");

        Continuation cc = ContinuationSupport.getContinuation(req);

        cc.suspend(res);

        return new ModelAndView();
    }
}
