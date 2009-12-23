/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 10:59:49
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.jdom.Document;
import org.jdom.input.SAXBuilder;
import springsprout.m31.common.OpenApiReadException;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;

import static springsprout.m31.common.M31System.ENCODING;

public class OpenApiRequestHelper {

    static HttpClient client = new DefaultHttpClient();
    static HttpGet apiurl = new HttpGet();
    
    public static InputStream loadApi(String url) {
        InputStream is = null;
        try {
            is = new URL(url).openConnection().getInputStream();
        } catch (IOException e) {
            throw new OpenApiReadException(e);
        }
        return is;
    }

    public static Document loadXml(String url) {
        Document doc = null;
        SAXBuilder parser = new SAXBuilder();
        parser.setIgnoringElementContentWhitespace(true);
        try {
            doc = parser.build(loadApi(url));
        } catch (Exception e) {
            throw new OpenApiReadException(e);
        }
        return doc;
    }
    
    public static String loadJString(String url,String encoding) {
        apiurl.setURI((URI.create(url)));
        try {
            return EntityUtils.toString(client.execute(apiurl).getEntity(),encoding);
        } catch (IOException e) {
            throw new OpenApiReadException("loadJString error..");
        }
    }

    public static String loadJString(String url) {
        return loadJString(url, ENCODING);
    }
}
