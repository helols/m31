/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:01:46
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import springsprout.m31.utils.JSONHelper;

import java.util.ArrayList;
import java.util.HashMap;

import static springsprout.m31.utils.OpenApiRequestHelper.loadJSON;

public class DaumAPIHelper {

    public static void springsee(ArrayList<HashMap<String, String>> r_list, String[] apiInfo, String query, Integer pageNo) {
        String api_url = apiInfo[0];
        String api_output = apiInfo[1];
        api_url += query+"&output="+api_output.toLowerCase();
        JSONHelper.jsonArrayConverToArrayList(r_list,loadJSON(api_url),"channel.item");
    }
}
