/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 10:59:49
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.apache.http.HttpEntity;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.xml.sax.InputSource;
import springsprout.m31.common.OpenApiReadException;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.ENCODING;

public class OpenApiRequestHelper {

    static HttpClient client = null;
    static HttpGet apiurl = new HttpGet();

    /**
     * InputStream 이 필요한경우 호출.
     *
     * @param url
     * @return InputStream
     */
    public static InputStream loadApi(String url) {
        try {
            apiurl.setURI((URI.create(url)));
            factoryHttpClient();
            return client.execute(apiurl).getEntity().getContent();
        } catch (IOException e) {
            throw new OpenApiReadException(e);
        }
    }

    /**
     * jdom 의 Document 가 필요 할경우.. 호출..
     *
     * @param url
     * @return jdom.Document
     */
    public static Document loadXml(String url) {
        Document doc = null;
        SAXBuilder parser = new SAXBuilder();
        parser.setIgnoringElementContentWhitespace(true);
        apiurl.setURI((URI.create(url)));
        factoryHttpClient();
        try {
            HttpEntity he = client.execute(apiurl).getEntity();
            doc = parser.build(new InputSource(new InputStreamReader(he.getContent(), EntityUtils.getContentCharSet(he))));
        } catch (Exception e) {
            throw new OpenApiReadException(e);
        }
        return doc;
    }

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 지정한 인코딩으로 돌려준다.
     *
     * @param url
     * @param encoding
     * @return
     */
    public static String loadString(String url, String encoding) {
        apiurl.setURI((URI.create(url)));
        factoryHttpClient();
        try {
            return EntityUtils.toString(client.execute(apiurl).getEntity(), encoding);
        } catch (IOException e) {
            throw new OpenApiReadException("loadString error..");
        }
    }

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 기본 인코딩 UTF-8
     *
     * @param url
     * @return
     */
    public static String loadString(String url) {
        return loadString(url, ENCODING);
    }

    /**
     * Document 를 HashMap으로 변환해서 돌려준다.. xml을 HashMap으로 사용할때 쓰면좋음.
     *
     * @param doc
     * @return
     */
    public static HashMap<String, Object> docElementValueToMap(Document doc) {
        return docToMap(doc, "V");
    }

    public static HashMap<String, Object> docAttributeValueToMap(Document doc) {
        return docToMap(doc, "A");
    }

    private static HashMap<String, Object> docToMap(Document doc, String type) {
        String status = "F";
        HashMap<String, Object> rMap = new HashMap<String, Object>();
        if(doc != null){
            List<Element> eList = ((Element) doc.getRootElement().getChildren().get(0)).getChildren();
            String tmpListName = null;
            for (Element el : eList) {
                if (el.getChildren().isEmpty()) {
                    rMap.put(el.getName(), type.equals("V") ? el.getValue() : el.getAttributeValue("data"));
                } else {
                    if (tmpListName == null || !tmpListName.equals(el.getName())) {
                        tmpListName = el.getName();
                        ArrayList<HashMap<String, String>> tList = new ArrayList<HashMap<String, String>>();
                        rMap.put(el.getName(), covertList(tList, el.getChildren(), type));
                    } else {
                        covertList((ArrayList<HashMap<String, String>>) rMap.get(el.getName()), el.getChildren(), type);
                    }
                }
            }
            status ="S";
        }
        rMap.put("STATUS",status);
        return rMap;
    }

    /**
     * docElementValueToMap 을 위한... 메소드..
     *
     * @param tList
     * @param eList
     * @return
     */
    private static ArrayList<HashMap<String, String>> covertList(ArrayList<HashMap<String, String>> tList, List<Element> eList, String type) {
        HashMap<String, String> rMap = new HashMap<String, String>();
        for (Element el : eList) {
            rMap.put(el.getName(), type.equals("V") ? el.getValue() : el.getAttributeValue("data"));
        }
        tList.add(rMap);
        return tList;
    }

    private static void factoryHttpClient(){
        client = new DefaultHttpClient();
    }

}
