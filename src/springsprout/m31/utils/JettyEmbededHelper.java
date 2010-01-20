/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 12:05:25
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.eclipse.jetty.deploy.ContextDeployer;
import org.eclipse.jetty.security.HashLoginService;
import org.eclipse.jetty.server.Server;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.xml.sax.SAXException;

import javax.annotation.PostConstruct;

//@Component
public class JettyEmbededHelper {

    @Autowired
    private Server server;

    @Autowired
    private ContextDeployer contextDeployer;
    @Autowired
    private HashLoginService hashLoginService;

    @Autowired
    private ApplicationContext ac ;

    @Autowired
    @Qualifier("m31cometHome")
    private String m31cometHome;

    @PostConstruct
    public void jettyStart() throws Exception, SAXException {
        System.setProperty("m31.comet.home", m31cometHome);
        contextDeployer.setAttribute("AC",ac);
        server.addBean(contextDeployer);
        server.addBean(hashLoginService);
        server.start();
    }
}
