/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:02:50
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;
import springsprout.m31.utils.OpenApiRequestHelper;

import java.util.ArrayList;
import java.util.HashMap;

public class GoogleAPIHelper {
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
    	String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        api_url += query+"&&rsz=large";
        api_url += "&start="+pageNo;
        System.out.println("Google api : " + api_url);

        ArrayList<HashMap<String, Object>> tmpList = JSONHelper.jsonArrayConverToArrayList(OpenApiRequestHelper.loadString(api_url),"responseData.results");
        for(HashMap<String, Object> tmpMap : tmpList){
            r_list.add(
                    new SpringseeDTO(
                    		tmpMap.get("tbUrl").toString()
                           ,tmpMap.get("width").toString()
                           ,tmpMap.get("height").toString()
                           ,tmpMap.get("titleNoFormatting").toString()
                           ,tmpMap.get("url").toString())
            );
        }
        return 0;
    }
}