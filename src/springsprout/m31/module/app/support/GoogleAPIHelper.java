/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:02:50
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import springsprout.m31.dto.SpringseeDTO;

import java.util.ArrayList;

public class GoogleAPIHelper {
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
    	String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        System.out.println("Google api : " + api_url);
//        api_url += query+"&output="+api_output.toLowerCase();
//        api_url += "&sort=1&pageno="+pageNo + "&result="+perPage;
//        
//        ArrayList<HashMap<String, String>> tmpList = JSONHelper.jsonArrayConverToArrayList(OpenApiRequestHelper.loadString(api_url),"channel.item");
//        for(HashMap<String, String> tmpMap : tmpList){
//            r_list.add(
//                    new SpringseeDTO(
//                            tmpMap.get("thumbnail")
//                           ,tmpMap.get("width")
//                           ,tmpMap.get("height")
//                           ,tmpMap.get("title")
//                           ,tmpMap.get("link"))
//            );
//        }
        return 0;
    }
}
