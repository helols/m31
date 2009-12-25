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
     * @param list
     * @param listName
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
     * @param obj
     * @return json 형식의 String
     */
    public static String domainToJSONstr(Object obj) {
        return JSONObject.fromObject(obj).toString();
    }
    /**
     * map 안에 담겨 있는 단일 object를 json String으로 변환해준다.
     * @param map
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
     * @param map
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
     * @param jsonString
     * @return HashMap
     */
    @SuppressWarnings("uncheched")
    public static HashMap covertHashMap(String jsonString) {
        return ((HashMap)JSONObject.toBean(JSONObject.fromObject(jsonString),HashMap.class));
    }

    /**
     * path에 해당하는 json array를 ArrayList안에 hashmap을 넣어서 반환한다.
     * @see JSONHelperTest.jsonArrayConverToArrayListTest
     * @param jsonString
     * @param path
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
