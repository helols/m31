/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 17
 * Time: 오전 11:13:38
 * enjoy springsprout ! development!
 */
package springsprout.m31.utils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.*;

/**
 * json string 관련 util.
 * @author isYoon
 */
public class JSONHelper {

    /**
     * 넘겨는 listNAme 의로 list를 json string 으로 변환해준다.
     * @param list 변환대상 list
     * @param listName root name
     * @return json 형식의 String
     */
    public static String listToJSONstr(List<?> list, String listName) {

        Map<String, Object> map = new HashMap<String, Object>();
        map.put(listName, JSONArray.fromObject(list));

        JSONObject jsonObject = JSONObject.fromObject(map);
        return jsonObject.toString();
    }

    /**
     * 해당 도메인 객체를 Json string 으로 변환해준다.
     * @param obj 변환 도메인 객체
     * @return json 형식의 String
     */
    public static String domainToJSONstr(Object obj) {
        return JSONObject.fromObject(obj).toString();
    }
    /**
     * map 안에 담겨 있는 단일 object를 json String으로 변환해준다.
     * @param map 변환할 MAP
     * @return json 형식의 String
     */

    @SuppressWarnings("unchecked")
    public static String mapInSingleToJSONstr(Map map) {

        Set<String> keySet = map.keySet();
        for(String key : keySet){
            map.put(key,JSONObject.fromObject(map.get(key)));
        }
        return JSONObject.fromObject(map).toString();
    }

    /**
     * map 안에 담겨 있는 array || list를 json String 으로 변환해준다.
     * @param map 변환할 MAP
     * @return
     */
    public static String mapInListToJSONstr(Map map) {
        Set<String> keySet = map.keySet();
        for(String key : keySet){
            map.put(key,JSONArray.fromObject(map.get(key)));
        }
        return JSONObject.fromObject(map).toString();
    }

    /**
     * 넘겨주는 문자열을 HashMap으로 돌려준다.
     * @param jsonString HashMap으로 담을 jsonSring.
     * @return HashMap
     */
    @SuppressWarnings("uncheched")
    public static HashMap covertHashMap(String jsonString) {
        return ((HashMap)JSONObject.toBean(JSONObject.fromObject(jsonString),HashMap.class));
    }

    /**
     * path에 해당하는 json array를 ArrayList안에 hashmap을 넣어서 반환한다.
     * @see JSONHelperTest.jsonArrayConverToArrayListTest
     * @see springsprout.m31.module.gateway.support.DaumAPIHelper.springsee()
     * @param jsonString  변환대상 json spring.
     * @param path jsonstring에서 변환을 시작할 array name. (ex: channel.item); ex value. "{\"channel\":{\"itm\":[{\"thumbnail\":\"http://image02.search.daum-img.net/03/0.c3.b6.BL_shopping-how_472_0.jpg\",\"width\":\"520\",\"height\":\"347\",\"cp\":\"7\",\"title\":\"[Daum Life Changers Shopping7]쇼핑하우를 IPTV 속으로 넣어보자!!\",\"image\":\"\",\"link\":\"http://blog.daum.net/shopping-how/472\",\"pubDate\":\"20091203212840\",\"author\":\"8AFQI\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.e7.8a.TI_460923862_0.jpg\",\"width\":\"750\",\"height\":\"474\",\"cp\":\"7\",\"title\":\"Daum검색\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/3\",\"pubDate\":\"20090826170811\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/8.8e.e7.TI_460921295_0.jpg\",\"width\":\"893\",\"height\":\"595\",\"cp\":\"7\",\"title\":\"Daum카페\",\"image\":\"\",\"link\":\"http://lucero.tistory.com/1\",\"pubDate\":\"20090826165238\",\"author\":\"jelldis@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/a.a8.a2.BL_aleedsun_39197_1.jpg\",\"width\":\"899\",\"height\":\"696\",\"cp\":\"7\",\"title\":\"절규\",\"image\":\"\",\"link\":\"http://blog.daum.net/aleedsun/39197\",\"pubDate\":\"20090601203220\",\"author\":\"pOPc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/b.8e.06.TI_apreview.tistory.com_7_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/1.ff.97.TI_tsunamis.tistory.com_72_4.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://tsunamis.tistory.com/72\",\"pubDate\":\"20090427135916\",\"author\":\"psw7574@naver.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/f.57.4b.TI_imchool.tistory.com_114_0.jpg\",\"width\":\"320\",\"height\":\"480\",\"cp\":\"7\",\"title\":\"Daum 지도\",\"image\":\"\",\"link\":\"http://imchool.tistory.com/114\",\"pubDate\":\"20090426231711\",\"author\":\"imchool@gmail.com\"},{\"thumbnail\":\"http://image02.search.daum-img.net/02/d.a2.de.TI_176500_4_0.jpg\",\"width\":\"1024\",\"height\":\"768\",\"cp\":\"7\",\"title\":\"Daum♡\",\"image\":\"\",\"link\":\"http://risyana.tistory.com/4\",\"pubDate\":\"20090208024841\",\"author\":\"risyana@hanmail.net\"},{\"thumbnail\":\"http://image02.search.daum-img.net/01/f.94.7f.BL_0MdNC_84_1.jpg\",\"width\":\"760\",\"height\":\"315\",\"cp\":\"15\",\"title\":\"daum 지도\",\"image\":\"\",\"link\":\"http://cafe.daum.net/HKKOREAN/4qWC/320?docid=1Db7e|4qWC|320|20090124125921\",\"pubDate\":\"20090124125921\",\"author\":\"4BVxc\"},{\"thumbnail\":\"http://image02.search.daum-img.net/03/5.69.b0.CF_1Fpgm_PntS_88_2.jpg\",\"width\":\"600\",\"height\":\"471\",\"cp\":\"15\",\"title\":\"daumpc\",\"image\":\"\",\"link\":\"http://cafe.daum.net/DaumPC/PntS/88?docid=1Fpgm|PntS|88|20081224212859\",\"pubDate\":\"20081224212859\",\"author\":\"4onQk\"}],\"sort\":\"1\",\"title\":\"Search image Daum Open API\",\"result\":\"10\",\"totalCount\":51876,\"pageno\":\"1\",\"q\":\"daum\",\"desc\":\"Daum Open API search result\"}}"; 이중에서 item 부분을 받고 싶을 경우에 해당함.
     * @return
     */
    @SuppressWarnings("unchecked")
    public static ArrayList<HashMap<String, Object>> jsonArrayConverToArrayList(String jsonString, String path) {

        ArrayList<HashMap<String, Object>> tmpList = new ArrayList<HashMap<String, Object>>();
        String[] paths = path.split("[.]");
        Iterator jsonIter = JSONArray.fromObject(JSONObject.fromObject(JSONObject.fromObject(jsonString).get(paths[0])).get(paths[1])).iterator();
        while(jsonIter.hasNext()){
            tmpList.add(covertHashMap(JSONObject.fromObject(jsonIter.next()).toString()));
        }
        return tmpList;
    }

}
