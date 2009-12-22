/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 10:59:49
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.jdom.Document;
import org.jdom.input.SAXBuilder;
import springsprout.m31.common.OpenApiReadException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;

import static springsprout.m31.common.M31System.ENCODING;

public class OpenApiRequestHelper {

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
            StringBuilder jsonBuilder = new StringBuilder();
        BufferedReader in = null;
        try {
            in = new BufferedReader(new InputStreamReader(loadApi(url), encoding));
            String readString = null;
            while ((readString = in.readLine()) != null){
                jsonBuilder.append(readString);
            }
        } catch (IOException e) {
            throw new OpenApiReadException(e);
        }finally {
            if(in != null){
                try {
                    in.close();
                } catch (IOException e) {
                    throw new OpenApiReadException(e);
                }
            }
        }
        return jsonBuilder.toString();

    }

    public static String loadJString(String url) {
        return loadJString(url, ENCODING);
    }
}
