/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:01:46
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.app.support;

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

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public class DaumAPIHelper {

    private final static Logger log = LoggerFactory.getLogger(DaumAPIHelper.class);

	private final static String MOVIE_URL = "http://apis.daum.net/search/vclip?apikey=d15e82f0b108d06e45ec70a9f7eec3aac3c0c61c";    
    
    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
        String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        api_url += query+"&output="+api_output.toLowerCase();
        api_url += "&sort=1&pageno="+pageNo + "&result="+perPage;
        System.out.println("Daum api : " + api_url);
        ArrayList<HashMap<String, Object>> tmpList = JSONHelper.jsonArrayConverToArrayList(OpenApiRequestHelper.loadString(api_url),"channel.item");
        for(HashMap<String, Object> tmpMap : tmpList){
            r_list.add(
                    new SpringseeDTO(
                            tmpMap.get("thumbnail").toString()
                           ,tmpMap.get("width").toString()
                           ,tmpMap.get("height").toString()
                           ,tmpMap.get("title").toString()
                           ,tmpMap.get("link").toString())
            );
        }
        return 0;
    }

    /**
     * DAUM API를 이용해서 동영상 검색 결과를 가져옵니다.
     * @param cri 검색 크리테리아.
     * @return 검색 결과를 담은 DTO.
     */
    public static SpringPlayerDTO getMovie(SpringPlayerCri cri) {
        SpringPlayerDTO dto = new SpringPlayerDTO();
        int pageno = (cri.getStart() / cri.getLimit()) + 1;        
        String url = MOVIE_URL + "&output=json&sort=exact&tagsearch=off&q="+cri.getQ()+"&result=" + cri.getLimit() + "&pageno=" + pageno;
        log.debug("getMovie 요청 URL : {}",url);
        
        String response = OpenApiRequestHelper.loadString(url);
        log.debug("Movie 응답 : {}", response);

        JSONObject json = JSONObject.fromObject(response).getJSONObject("channel");
        dto.setSuccess(true);
        dto.setTotal(json.getInt("totalCount"));

        List<MovieVO> list = new ArrayList<MovieVO>();
        JSONArray jsonArray = json.getJSONArray("item");
        Iterator iter = jsonArray.listIterator();

        while(iter.hasNext()) {
            JSONObject j = (JSONObject) iter.next();
            MovieVO vo = new MovieVO();
            vo.setSource("daum");
            vo.setTitle(j.getString("title"));
            vo.setAuthor(j.getString("author"));
            vo.setDuration(j.getString("playtime"));
            try {
                vo.setPlayerURL(new URL(j.getString("player_url")));
                vo.setThumbnailURL(new URL(j.getString("thumbnail")));
            } catch (MalformedURLException e) {
                throw new RuntimeException(e);
            }
            list.add(vo);
        }
        
        dto.setList(list);

        return dto;
    }
}
