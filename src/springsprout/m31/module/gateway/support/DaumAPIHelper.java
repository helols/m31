/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:01:46
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import static springsprout.m31.utils.OpenApiRequestHelper.docElementValueToMap;
import static springsprout.m31.utils.OpenApiRequestHelper.loadXml;

import com.google.gdata.util.common.net.UriEncoder;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import springsprout.m31.domain.MovieVO;
import springsprout.m31.dto.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;
import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;
import springsprout.m31.utils.OpenApiRequestHelper;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.*;

public class DaumAPIHelper {

    private final static Logger log = LoggerFactory.getLogger(DaumAPIHelper.class);

	private final static String MOVIE_URL = "http://apis.daum.net/search/vclip?apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c";    
    
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
        String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        if (perPage > 20) {perPage = 20;}
        api_url += query+"&output="+api_output.toLowerCase();
        api_url += "&sort=1&pageno="+pageNo + "&result="+perPage;
        log.debug("Daum api : " + api_url);
        Integer totalCount = 0;

        HashMap<String,Object> rMap =  docElementValueToMap(loadXml(api_url),false);
        if(rMap.get("item") == null){
            return 0;
        }
        for (HashMap<String, String> tmpMap : (ArrayList<HashMap<String, String>>) rMap.get("item")) {
            r_list.add(
                    new SpringseeDTO(
                              tmpMap.get("thumbnail")
                            , tmpMap.get("width")
                            , tmpMap.get("height")
                            , tmpMap.get("title")
                            , tmpMap.get("link")
                            , tmpMap.get("image"))
            );
        }
        totalCount = new Integer(rMap.get("result").toString());

        return totalCount;
    }

    /**
     * DAUM API를 이용해서 동영상 검색 결과를 가져옵니다.
     * @param cri 검색 크리테리아.
     * @return 검색 결과를 담은 DTO.
     */
    public static SpringPlayerDTO getMovie(SpringPlayerCri cri) {
        SpringPlayerDTO dto = new SpringPlayerDTO();
        int pageno = (cri.getStart() / cri.getLimit()) + 1;
        String url = MOVIE_URL + "&output=json&sort=exact&tagsearch=off&q="+ UriEncoder.encode(cri.getQ())+"&result=" + cri.getLimit() + "&pageno=" + pageno;

        log.debug("getMovie 요청 URL : {}",url);
        
        String response = OpenApiRequestHelper.loadString(url);
        log.debug("Movie 응답 : {}", response);

        JSONObject json = JSONObject.fromObject(response).getJSONObject("channel");
        dto.setSuccess(true);
        //Daum API의 pageno의 최대값은 500.
        if(json.getInt("totalCount") < 500 * cri.getLimit()) {
            dto.setTotal(json.getInt("totalCount"));
        } else {
            dto.setTotal(500 * cri.getLimit());
        }

        List<MovieVO> list = new ArrayList<MovieVO>();
        JSONArray jsonArray = json.getJSONArray("item");
        Iterator iter = jsonArray.listIterator();

        while(iter.hasNext()) {
            JSONObject j = (JSONObject) iter.next();
            MovieVO vo = new MovieVO();
            vo.setSource("daum");
            vo.setTitle(j.getString("title"));
            vo.setAuthor(j.getString("author"));
            vo.setDuration(Integer.parseInt(j.getString("playtime")));
            vo.setPlayerURL(j.getString("player_url"));
            vo.setThumbnailURL(j.getString("thumbnail"));

            list.add(vo);
        }
        
        dto.setList(list);

        return dto;
    }
}
