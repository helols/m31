/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오전 10:02:14
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.gateway.support;

import static springsprout.m31.utils.OpenApiRequestHelper.docElementValueToMap;
import static springsprout.m31.utils.OpenApiRequestHelper.loadXml;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.beans.MutablePropertyValues;
import org.springframework.util.CollectionUtils;

import springsprout.m31.domain.Book;
import springsprout.m31.dto.SpringBookDTO;
import springsprout.m31.dto.SpringseeDTO;
import springsprout.m31.utils.OpenApiRequestHelper;

public class NaverAPIHelper {
	
	private final static Logger log = LoggerFactory.getLogger(FlickrAPIHelper.class);

    public static Integer springsee(ArrayList<SpringseeDTO> r_list, String[] apiInfo, String query, Integer pageNo, Integer perPage) {
        String api_url = apiInfo[0];
        pageNo = (pageNo -1) * perPage + 1;
        api_url += query;
        api_url += "&sort=sim&start="+pageNo + "&display="+perPage;
        log.debug("Naver api : " + api_url); 
        HashMap<String,Object> rMap =  docElementValueToMap(loadXml(api_url),false);
        if(rMap.get("item") == null){
            return 0;
        }
        for (HashMap<String, String> tmpMap : (ArrayList<HashMap<String, String>>) rMap.get("item")) {
            r_list.add(
                    new SpringseeDTO(
                              tmpMap.get("thumbnail")
                            , tmpMap.get("sizewidth")
                            , tmpMap.get("sizeheight")
                            , tmpMap.get("title")
                            , tmpMap.get("link")
                            , tmpMap.get("link"))
            );
        }
        return new Integer(rMap.get("total").toString());
    }
    
    /**
     * 네이버 책 API 로 조회하자!
     * @param param
     * @return
     */
    @SuppressWarnings("unchecked")
	public static SpringBookDTO book(SpringBookSearchParam param) {
    	SpringBookDTO library = null;
    	String requestUrl = param.getApiUrl() + param.getQuery();

    	log.debug("Naver book api : " + requestUrl);
        
    	Document document = OpenApiRequestHelper.loadXml(requestUrl);
		if(document != null){
			Element channel = document.getRootElement().getChild("channel");
			library = (SpringBookDTO) convertElementToBean(channel, SpringBookDTO.class);
			if(library != null){
				library.setBooks(convertItemElementToBeanList(document, Book.class));
			}
		}
		
		return library;
    }
    
    /**
     * 네이버 API 검색 결과로부터 rss.channel 내의 item 엘리먼트들을  bean 으로 생성해서 List 로 반환한다.
     * @param document
     * @param beanClass
     * @return
     */
	@SuppressWarnings("unchecked")
	private static List convertItemElementToBeanList(Document document, Class beanClass) {
		if(document == null){
			return Collections.emptyList();
		}
		if(document.getRootElement() == null){
			return Collections.emptyList();
		}
		if(document.getRootElement().getChild("channel") != null){
			List<Element> itemList = document.getRootElement().getChild("channel").getChildren("item");
			if(!CollectionUtils.isEmpty(itemList)){
				List<Object> beanList = new ArrayList<Object>();
				for(Element item : itemList){
					Object bean = convertElementToBean(item, beanClass);
					if(bean != null) beanList.add(bean);
				}
				return beanList;
			}
		}
		return Collections.emptyList();
	}
	
	/**
	 * 해당 엘리먼트내의 값들을 bean 으로 생성해서 반환한다.
	 * @param source
	 * @param beanClass
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private static Object convertElementToBean(Element source, Class beanClass) {
		if(source == null){
			return null;
		}
		List<Element> elements = source.getChildren();
		if(!CollectionUtils.isEmpty(elements)){
			BeanWrapper beanWrapper = new BeanWrapperImpl(beanClass);
			MutablePropertyValues propertyValues = new MutablePropertyValues();
			for(Element element : elements){
				propertyValues.add(element.getName(), element.getValue());
			}
			beanWrapper.setPropertyValues(propertyValues, true);
			return beanWrapper.getWrappedInstance();
		}
		return null;
	}    
}
