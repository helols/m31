/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오후 9:40:35
 * enjoy springsprout ! development!
 */
package springsprout.m31.dto;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.springframework.util.CollectionUtils;

import springsprout.m31.domain.Book;

public class SpringBookDTO {
	
	/** 검색 결과를 생성한 시간입니다. */
	private String lastBuildDate;
	/** 검색 결과 문서의 총 개수를 의미합니다. */
	private int total;
	/** 검색 결과 문서 중, 문서의 시작점을 의미합니다. */
	private int start;
	/** 검색된 검색 결과의 개수입니다. */
	private int display;
	/** 검색된 책 목록 */
	private List<Book> books;
    
	public String getLastBuildDate() {
		return lastBuildDate;
	}
	public void setLastBuildDate(String lastBuildDate) {
		this.lastBuildDate = lastBuildDate;
	}

	public int getTotal() {
		// 네이버 OpenApi 제한에 검색 갯수가 1000 으로 한계지어있다. 1000 이후의 갯수는 무용지물...-_-!
		return total > 1000 ? 1000 : total;
	}
	public void setTotal(int total) {
		this.total = total;
	}

	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}

	public int getDisplay() {
		return display;
	}
	public void setDisplay(int display) {
		this.display = display;
	}
	
	public List<Book> getBooks() {
		return CollectionUtils.isEmpty(books) ? new ArrayList<Book>() : books;
	}
	public void setBooks(List<Book> books) {
		this.books = books;
	}
	
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
