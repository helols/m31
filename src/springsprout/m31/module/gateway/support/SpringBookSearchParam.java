package springsprout.m31.module.gateway.support;

public class SpringBookSearchParam {

	/** 검색종류(네이버, 다음) */
	private String searchType;
	/** api 주소 */
	private String apiUrl;
	/** 검색할 책이름 */
	private String query;
	/** 조회할 게시물 순번 */
	private int start;
	/** 한번에 조회할 게시물 수(기본 20) */
	private int limit = 20;
	
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
	
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	
}