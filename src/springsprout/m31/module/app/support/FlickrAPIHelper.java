/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:03:13
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;
import springsprout.m31.utils.OpenApiRequestHelper;

import java.util.ArrayList;
import java.util.HashMap;

public class FlickrAPIHelper {
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
    	String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        api_url += query+"&format="+api_output.toLowerCase();
        api_url += "&sort=interestingness-asc&content_type=7&media=photos&page="+pageNo + "&per_page="+perPage + "&extras=owner_name";
        System.out.println("Flickr api : " + api_url);

        String resultFlickr = OpenApiRequestHelper.loadString(api_url);
        resultFlickr = resultFlickr.replace("jsonFlickrApi(", "").replace(")", "");
        ArrayList<HashMap<String, Object>> tmpList = JSONHelper.jsonArrayConverToArrayList(resultFlickr,"photos.photo");
        for(HashMap<String, Object> tmpMap : tmpList){
        	String photoUrl  = "http://farm" + tmpMap.get("farm") + ".static.flickr.com/" + tmpMap.get("server") + "/" + tmpMap.get("id") + "_" + tmpMap.get("secret") + "_s.jpg";
        	String photoLink = "http://www.flickr.com/photos/" + tmpMap.get("owner") + "/" + tmpMap.get("id");
            r_list.add(
                    new SpringseeDTO(
                    		photoUrl
                           ,""
                           ,""
                           ,tmpMap.get("title").toString()
                           ,photoLink)
            );
        }
        return 0;
    }
}