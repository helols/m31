/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:02:50
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import com.google.gdata.client.youtube.YouTubeQuery;
import com.google.gdata.client.youtube.YouTubeService;
import com.google.gdata.data.youtube.VideoEntry;
import com.google.gdata.data.youtube.VideoFeed;
import com.google.gdata.data.youtube.YouTubeMediaContent;
import com.google.gdata.data.youtube.YouTubeMediaGroup;
import com.google.gdata.util.ServiceException;
import springsprout.m31.common.OpenApiReadException;
import springsprout.m31.domain.MovieVO;
import springsprout.m31.dto.SpringPlayerCri;
import springsprout.m31.dto.SpringPlayerDTO;
import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.JSONHelper;
import springsprout.m31.utils.OpenApiRequestHelper;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GoogleAPIHelper {

    /**
     * The name of the server hosting the YouTube GDATA feeds
     */
    public static final String YOUTUBE_GDATA_SERVER = "http://gdata.youtube.com";

    /**
     * The URL of the "Videos" feed
     */
    public static final String VIDEOS_FEED = YOUTUBE_GDATA_SERVER + "/feeds/api/videos";

    private static final YouTubeService youTubeService = new YouTubeService("m31-YouTube");
    
    private final static Logger log = LoggerFactory.getLogger(FlickrAPIHelper.class);

    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
    	String api_url = apiInfo[0]; //
        String api_output = apiInfo[1];
        api_url += query+"&&rsz=large";
        api_url += "&start="+pageNo;
        log.debug("Google api : " + api_url);

//        ArrayList<HashMap<String, Object>> tmpList = JSONHelper.jsonArrayConverToArrayList(OpenApiRequestHelper.loadString(api_url),"responseData.results");
        HashMap<String, Object> jsonMap = JSONHelper.jsonArrayConverToArrayList(OpenApiRequestHelper.loadString(api_url),"responseData");
        for(HashMap<String, Object> tmpMap : (ArrayList<HashMap<String, Object>>)jsonMap.get("results")){
            r_list.add(
                    new SpringseeDTO(
                    		tmpMap.get("tbUrl").toString()
                           ,tmpMap.get("width").toString()
                           ,tmpMap.get("height").toString()
                           ,tmpMap.get("titleNoFormatting").toString()
                           ,tmpMap.get("url").toString()
                           ,tmpMap.get("url").toString())
            );
        }
        return 0;
    }

    public static SpringPlayerDTO getMovie(SpringPlayerCri cri) throws OpenApiReadException {
        SpringPlayerDTO dto = new SpringPlayerDTO();

        try {
            YouTubeQuery query = new YouTubeQuery(new URL(VIDEOS_FEED));

            // order results by the number of views (most viewed first)
            query.setOrderBy(YouTubeQuery.OrderBy.VIEW_COUNT);            
            // do not exclude restricted content from the search results
            query.setSafeSearch(YouTubeQuery.SafeSearch.NONE);

            query.setStartIndex(cri.getStart()+1); // YouTube Index는 1부터 시작.
            query.setMaxResults(cri.getLimit());

            query.setFullTextQuery(cri.getQ());

            VideoFeed videoFeed = youTubeService.query(query, VideoFeed.class);

            dto.setTotal(videoFeed.getTotalResults());
            dto.setSuccess(true);

            List<MovieVO> list = new ArrayList<MovieVO>();
            for (VideoEntry ve : videoFeed.getEntries()) {
                MovieVO vo = new MovieVO();
                vo.setSource("google");
                vo.setTitle(ve.getTitle().getPlainText());

                YouTubeMediaGroup mediaGroup = ve.getMediaGroup();
                vo.setThumbnailURL(mediaGroup.getThumbnails().get(0).getUrl());
                vo.setAuthor(mediaGroup.getUploader());
                
                boolean sw = false;
                for(YouTubeMediaContent mediaContent : mediaGroup.getYouTubeContents()) {
                   if("application/x-shockwave-flash".equals(mediaContent.getType())) {                       
                        vo.setPlayerURL(mediaContent.getUrl());
                        vo.setDuration(mediaContent.getDuration());

                        sw = true;
                        break;
                    }
                }

                // 소스가 공개되지 않은 동영상은 Web 페이지 링크만 제공하여 무시함.
                if(sw == false) {
                    continue;
                }

                list.add(vo);
            }
            
            dto.setList(list);

            return dto;    
        } catch (MalformedURLException e) {
            throw new OpenApiReadException("YouTube Data 가져오기 실패.",e);
        } catch (ServiceException e) {
            throw new OpenApiReadException("YouTube Data 가져오기 실패.", e);
        } catch (IOException e) {
            throw new OpenApiReadException("YouTube Data 가져오기 실패.",e);
        }
    }
}