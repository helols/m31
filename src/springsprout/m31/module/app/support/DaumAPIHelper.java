/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:01:46
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import springsprout.m31.domain.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;

import java.util.ArrayList;
import java.util.HashMap;

import static springsprout.m31.utils.OpenApiRequestHelper.loadJSON;

public class DaumAPIHelper {

    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo) {
        String api_url = apiInfo[0];
        String api_output = apiInfo[1];
        api_url += query+"&output="+api_output.toLowerCase();
        ArrayList<HashMap<String, String>> tmpList = JSONHelper.jsonArrayConverToArrayList(loadJSON(api_url),"channel.item");
        for(HashMap<String, String> tmpMap : tmpList){            
            r_list.add(
                    new SpringseeDTO(
                            tmpMap.get("thumbnail")
                           ,tmpMap.get("width")
                           ,tmpMap.get("height")
                           ,tmpMap.get("title")
                           ,tmpMap.get("link"))
            );
        }
        return 0;
    }
}
