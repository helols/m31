package springsprout.m31.domain;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.springframework.util.StringUtils;

public class Book {

	/** 검색 결과 문서의 제목을 나타냅니다. 제목에서 검색어와 일치하는 부분은 <b> 태그로 감싸져 있습니다. */
    private String title;
    /** 검색 결과 문서의 하이퍼텍스트 link를 나타냅니다. */
    private String link;
    /** 썸네일 이미지의 URL입니다. 이미지가 있는 경우만 나타납니다. */
    private String image;
    /** 저자정보입니다. */
    private String author;
    /** 정가 정보입니다. 절판도서 등으로 가격이 없으면 나타나지 않습니다. */
    private int price;
    /** 할인 가격정보입니다. 절판도서 등으로 가격이 없으면 나타나지 않습니다. */
    private int discount;
    /** 출판사 정보입니다. */
    private String publisher;
    /** 출간일 정보입니다. */
    private String pubdate;
    /** ISBN 넘버입니다. */
    private String isbn;
    /** 검색 결과 문서의 내용을 요약한 패시지 정보입니다. 문서 전체의 내용은 link 를 따라가면, 읽을 수 있습니다. 패시지에서 검색어와 일치하는 부분은 <b> 태그로 감싸져 있습니다. */
    private String description;
    
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = StringUtils.replace(StringUtils.replace(title, "<strong>", ""), "</strong>", "");
	}
	
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	
	public int getDiscount() {
		return discount;
	}
	public void setDiscount(int discount) {
		this.discount = discount;
	}
	
	public String getPublisher() {
		return publisher;
	}
	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}
	
	public String getPubdate() {
		return pubdate;
	}
	public void setPubdate(String pubdate) {
		this.pubdate = pubdate;
	}
	
	public String getIsbn() {
		return isbn;
	}
	public void setIsbn(String isbn) {
		this.isbn = isbn;
	}
	
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
    
	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
	
}
