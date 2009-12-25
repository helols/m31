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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

import static springsprout.m31.common.M31System.JSON_VIEW;

//@Controller
public class M31CometController {

    Logger log = LoggerFactory.getLogger(getClass());

    ConcurrentHashMap<String, Continuation> store = new ConcurrentHashMap<String, Continuation>();
    String a = "Abc";

    @RequestMapping("/m31comet/request")
    public ModelAndView request(HttpServletRequest req, @RequestParam String sessionId) {

        Continuation continuation = ContinuationSupport.getContinuation(req);
        continuation.setTimeout(20000);

        log.debug("request stat >> "+new Date().toString());
        if(continuation.isInitial()){
            log.debug("init date>> " + new Date().toString());
            store.put(sessionId, continuation);
            continuation.suspend();
            System.out.println("dddd");
//            return new ModelAndView(DUMMY_VIEW);
        }else{
            log.debug("espire date>> " + new Date().toString());
            return new ModelAndView(JSON_VIEW).addObject("request","expire");
        }
        System.out.println("rrr");
        return new ModelAndView(JSON_VIEW).addObject("init",a);

    }

    @RequestMapping("/m31comet/test")
    public ModelAndView test(HttpServletRequest req, HttpServletResponse res,@RequestParam String sessionId) {
        a= "GGGGGGGG";
        store.get(sessionId).resume();
        return new ModelAndView(JSON_VIEW).addObject("test",new Date().toString());
    }
}
