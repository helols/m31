/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 25
 * Time: 오후 12:05:25
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.xml.XmlConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
public class JettyEmbededHelper {

    private Server server;

    @Autowired
    @Qualifier("m31cometHome")
    private String m31cometHome;

    @Autowired
    @Qualifier("m31cometPort")
    private String m31cometPort;

    @PostConstruct
    public void jettyStart() throws Exception, SAXException {
        System.setProperty("m31.comet.home", m31cometHome);
        System.setProperty("m31.comet.port", m31cometPort);
        Resource fileserver_xml = Resource.newSystemResource("m31comet.xml");
        XmlConfiguration configuration = new XmlConfiguration(fileserver_xml.getInputStream());
        server = (Server)configuration.configure();
        server.start();
//        server.join();
    }

    @PreDestroy
    public void jeetyStop() throws Exception {
        server.stop();
    }
}
