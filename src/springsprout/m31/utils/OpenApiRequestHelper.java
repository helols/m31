/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 10:59:49
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.params.ConnRoutePNames;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.xml.sax.InputSource;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.ENCODING;

public class OpenApiRequestHelper {

    static AbstractHttpClient client = null;
    static HttpGet apiurl = new HttpGet();
    static final HttpHost proxy = new HttpHost("dev.springsprout.org", 8088);

    /**
     * InputStream 이 필요한경우 호출.
     *
     * @param url 읽어올 URL..
     * @return InputStream 읽어온 Stream.
     */
    public static InputStream loadApi(String url) {
        try {
            apiurl.setURI((URI.create(url)));
            factoryHttpClient();
            return client.execute(apiurl).getEntity().getContent();
        } catch (IOException e) {
//            throw new OpenApiReadException(e);
            return null;
        }
    }

    /**
     * jdom 의 Document 가 필요 할경우.. 호출..
     *
     * @param url 읽어올 URL..
     * @return jdom.Document SAX 에서 사용할 수 있는 org.jdom.Document
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
//            throw new OpenApiReadException(e);
            doc = null;
        }
        return doc;
    }

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 지정한 인코딩으로 돌려준다.
     *
     * @param url      읽어올 URL..
     * @param encoding String을 읽어올 때 변환할 인코딩 지정.
     * @return 읽어 드린 string
     */
    public static String loadString(String url, String encoding) {
        apiurl.setURI((URI.create(url)));
        factoryHttpClient();
        try {
            return EntityUtils.toString(client.execute(apiurl).getEntity(), encoding);
        } catch (IOException e) {
//            throw new OpenApiReadException("loadString error..");
            return null;
        }
    }

    /**
     * 요청 url로 부터 String을 얻는다. ( JSON 일경우에 사용하기 적합.) 기본 인코딩 UTF-8
     *
     * @param url 읽어올 URL..
     * @return 읽어 드린 string
     */
    public static String loadString(String url) {
        return loadString(url, ENCODING);
    }

    /**
     * Document 를 HashMap으로 변환해서 돌려준다.. xml을 HashMap으로 사용할때 쓰면좋음. (엘리먼트의 text값을 읽음.)
     *
     * @param Jdom의  Document.(loadXml에서 읽어 드린 doc.)
     * @param isRoot .. true : root 부터 파싱 (미투용) //  false : root의 첫번째 엘리먼트의 차일드 엘리먼트 부터 읽음. (네이버 , 다음, 구글용.)
     * @return xml 형태의 HashMap 객체.
     */
    public static HashMap<String, Object> docElementValueToMap(Document doc, boolean isRoot) {
        return docToMap(doc, "V", isRoot);
    }

    /**
     * Document 를 HashMap으로 변환해서 돌려준다.. xml을 HashMap으로 사용할때 쓰면좋음. 엘리먼트의 attr의 값을 읽음. - 구글.. 처럼.
     *
     * @param Jdom의  Document.(loadXml에서 읽어 드린 doc.)
     * @param isRoot .. true : root 부터 파싱 (미투용) //  false : root의 첫번째 엘리먼트의 차일드 엘리먼트 부터 읽음. (네이버 , 다음, 구글용.)
     * @return xml 형태의 HashMap 객체.
     */
    public static HashMap<String, Object> docAttributeValueToMap(Document doc, boolean isRoot) {
        return docToMap(doc, "A", isRoot);
    }

    private static HashMap<String, Object> docToMap(Document doc, String type, boolean isRoot) {
        String status = "F";
        HashMap<String, Object> rMap = new HashMap<String, Object>();
        if (doc != null) {
            List<Element> eList = new ArrayList<Element>();
            if (isRoot) {
                eList = doc.getRootElement().getChildren();
            } else {
                eList = ((Element) doc.getRootElement().getChildren().get(0)).getChildren();
            }
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
            status = "S";
        }
        rMap.put("STATUS", status);
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

    private static void factoryHttpClient() {
        client = new DefaultHttpClient();
        client.getParams().setParameter(ConnRoutePNames.DEFAULT_PROXY, proxy);
    }
}
