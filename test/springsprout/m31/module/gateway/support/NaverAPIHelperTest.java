package springsprout.m31.module.gateway.support;

import org.junit.Test;

public class NaverAPIHelperTest {
	
	@Test
	public void 네이버책검색하기(){
		SpringBookSearchParam param = new SpringBookSearchParam();
		param.setApiUrl("http://openapi.naver.com/search?key=b020ac68a52b2089aae394e4ec7bff2d&target=book&query=");
		param.setQuery("자바스크립트");
		
		System.out.println(NaverAPIHelper.book(param));
	}
	
}
