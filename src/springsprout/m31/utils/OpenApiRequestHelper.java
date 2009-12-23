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
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import springsprout.m31.common.OpenApiReadException;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.ENCODING;

public class OpenApiRequestHelper {

    static HttpClient client = new DefaultHttpClient();
    static HttpGet apiurl = new HttpGet();

    /**
     * InputStream 이 필요한경우 호출.
     * @param url
     * @return InputStream
     */
    public static InputStream loadApi(String url) {
        InputStream is = null;
        try {
            is = new URL(url).openConnection().getInputStream();
        } catch (IOException e) {
            throw new OpenApiReadException(e);
        }
        return is;
    }

    /**
     * jdom 의 Document 가 필요 할경우.. 호출..
     * @param url
     * @return jdom.Document
     */
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

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 지정한 인코딩으로 돌려준다.
     * @param url
     * @param encoding
     * @return
     */
    public static String loadString(String url, String encoding) {
        apiurl.setURI((URI.create(url)));
        try {
            return EntityUtils.toString(client.execute(apiurl).getEntity(), encoding);
        } catch (IOException e) {
            throw new OpenApiReadException("loadString error..");
        }
    }

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 기본 인코딩 UTF-8
     * @param url
     * @return
     */
    public static String loadString(String url) {
        return loadString(url, ENCODING);
    }

    /**
     * Document 를 HashMap으로 변환해서 돌려준다.. xml을 HashMap으로 사용할때 쓰면좋음.
      * @param doc
     * @return
     */
    public static HashMap docToMap(Document doc) {
        List<Element> eList = ((Element) doc.getRootElement().getChildren().get(0)).getChildren();
        HashMap<String, Object> rMap = new HashMap<String, Object>();
        String tmpListName = null;
        for (Element el : eList) {
            if (el.getChildren().isEmpty()) {
                rMap.put(el.getName(), el.getValue());
            } else {
                if (tmpListName == null || !tmpListName.equals(el.getName())) {
                    tmpListName = el.getName();
                    ArrayList<HashMap<String, String>> tList = new ArrayList<HashMap<String, String>>();
                    rMap.put(el.getName(), covertList(tList, el.getChildren()));
                } else {
                    covertList((ArrayList<HashMap<String, String>>) rMap.get(el.getName()), el.getChildren());
                }
            }
        }
        return rMap;
    }

    /**
     * docToMap 을 위한... 메소드.. 
     * @param tList
     * @param eList
     * @return
     */
    private static ArrayList<HashMap<String, String>> covertList(ArrayList<HashMap<String, String>> tList, List<Element> eList) {
        HashMap<String, String> rMap = new HashMap<String, String>();
        for (Element el : eList) {
            rMap.put(el.getName(), el.getValue());
        }
        tList.add(rMap);
        return tList;
    }

}
