package springsprout.m31.module.gateway.support;

public class SpringBookSearchParam {

	/** 검색종류(네이버, 다음) */
	private String searchType;
	/** api 주소 */
	private String apiUrl;
	/** 검색할 책이름 */
	private String query;
	
	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	
	public String getApiUrl() {
		return apiUrl;
	}
	public void setApiUrl(String apiUrl) {
		this.apiUrl = apiUrl;
	}
	
	public String getQuery() {
		return query;
	}
	public void setQuery(String query) {
		this.query = query;
	}
	
	
	
}
