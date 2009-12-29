/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:03:13
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;
import springsprout.m31.utils.OpenApiRequestHelper;

import java.util.ArrayList;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FlickrAPIHelper {
	private final static Logger log = LoggerFactory.getLogger(FlickrAPIHelper.class);
	
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
    	String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        api_url += query+"&format="+api_output.toLowerCase();
        api_url += "&sort=interestingness-asc&content_type=7&media=photos&page="+pageNo + "&per_page="+perPage + "&extras=owner_name";
        log.debug("Flickr api : " + api_url);

        String resultFlickr = OpenApiRequestHelper.loadString(api_url);
        resultFlickr = resultFlickr.replace("jsonFlickrApi(", "").replace(")", "");
//        ArrayList<HashMap<String, Object>> tmpList = JSONHelper.jsonArrayConverToArrayList(resultFlickr,"photos.photo");
        HashMap<String, Object> jsonMap = JSONHelper.jsonArrayConverToArrayList(resultFlickr,"photos");
        for(HashMap<String, Object> tmpMap : (ArrayList<HashMap<String, Object>>)jsonMap.get("photo")){
        	String photoUrl  = "http://farm" + tmpMap.get("farm") + ".static.flickr.com/" + tmpMap.get("server") + "/" + tmpMap.get("id") + "_" + tmpMap.get("secret") + "_s.jpg";
        	String photoUrlOrign  = "http://farm" + tmpMap.get("farm") + ".static.flickr.com/" + tmpMap.get("server") + "/" + tmpMap.get("id") + "_" + tmpMap.get("secret") + ".jpg";
        	String photoLink = "http://www.flickr.com/photos/" + tmpMap.get("owner") + "/" + tmpMap.get("id");
            r_list.add(
                    new SpringseeDTO(
                    		photoUrl
                           ,""
                           ,""
                           ,tmpMap.get("title").toString()
                           ,photoLink
                           ,photoUrlOrign)
            );
        }
        return 0;
    }
}