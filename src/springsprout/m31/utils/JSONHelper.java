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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    public static HashMap covertHashMap(String jsonString) {
        return ((HashMap)JSONObject.toBean(JSONObject.fromObject(jsonString),HashMap.class));
    }
}
