package springsprout.m31.module.app.me2day.support;

import springsprout.m31.module.app.me2day.entity.Location;


/**
 * 미투데이 글 작성용 DTO
 * post[body]    : 글 본문. 미투데이 글 작성 문법을 따릅니다.
 * post[tags]    : 태그. 태그는 공백으로 구분합니다.
 * post[icon]    : 아이콘번호. 1 부터 12까지 지정가능합니다. 지정하지 않는 경우 1번 생각글 아이콘이 지정됩니다.
 * receive_sms   : SMS 댓글 수신 여부. "true"로 지정한 경우 작성한 글에 작성된 댓글을 작성자의 핸드폰 문자 메시지로 발송합니다. 지정하지 않거나 "true" 이외의 값을 지정하는 경우 댓글을 핸드폰 문자 메시지로 발송하지 않습니다.
 * icon_url      : 글 아이콘으로 사용할 이미지 URL을 지정합니다. 이미지 크기는 44X44 입니다. icon_url로 글 아이콘이 지정되는 경우 post[icon]으로 지정된 아이콘은 무시됩니다. 이 파라미터는 프리미엄 제휴 파트너만 사용할 수 있습니다.
 * callback_url  : 아이콘을 클릭했을때 말풍선으로 표시될 HTML 마크업을 제공하는 URL을 지정합니다. HTML 마크업은 DOCTYPE XHTML 1.0 Strict 에 대해 유효한 형식으로 제공해야 하며 스크립트를 포함할 수 없습니다. callback_url을 통해 제공되는 마크업은 포함되는 페이지 디자인을 해치지 않는 범위에서 인라인 CSS 스타일을 지정할 수 있습니다.
 * content_type  : callback_url을 통해 제공하는 컨텐트 종류을 지정합니다. 예를 들어 "document", "photo", "video", "audio" 등의 값을 지정합니다.
 * longitude     : 경도 정보를 저장 합니다. float형태로 입력합니다. 메르카토 도법(WGS)사용.  예) 127.05590
 * latitude      : 위도 정보를 저장 합니다. float형태로 입력합니다. 메르카토 도법(WGS)사용.  예) 37.50750
 * location      : 위치 정보를 저장 합니다. 위 위도의 경도와 위도의 지역명을 입력하면 됩니다. 지정하지 않을 경우, 사용자가 미투데이에서 설정한 지역명을 그대로 이용하게 됩니다.
 * attachment    : 사진파일(jpg)을 첨부해 글을 작성합니다. 업로드한 사진은 사용자가 지정한 사진서비스(flickr, 푸딩 등)에 업로드됩니다. attachment 에 사진파일을 지정해 업로드하기 위해서는 multipart/form-data로 인코딩해야 합니다. 업로드할 파일의 크기는 10M로 제한됩니다.
 * close_comment : 'true'로 지정한 경우 댓글을 닫고 글이 작성됩니다. 지정하지 않은 경우 사용자의 자동댓글닫기 설정을 따릅니다. * @author arawn
 */
public class PostDTO {
	
	private String body;
	private String tags;
	private int icon;
	private boolean receive_sms;
	private String icon_url;
	private String callback_url;
	private String content_type;
	private float longitude;
	private float latitude;
	private Location location;
	private boolean close_comment;
	
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	
	public String getTags() {
		return tags;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}
	
	public int getIcon() {
		return icon;
	}
	public void setIcon(int icon) {
		this.icon = icon;
	}
	
	public boolean isReceive_sms() {
		return receive_sms;
	}
	public void setReceive_sms(boolean receiveSms) {
		receive_sms = receiveSms;
	}
	
	public String getIcon_url() {
		return icon_url;
	}
	public void setIcon_url(String iconUrl) {
		icon_url = iconUrl;
	}
	
	public String getCallback_url() {
		return callback_url;
	}
	public void setCallback_url(String callbackUrl) {
		callback_url = callbackUrl;
	}
	
	public String getContent_type() {
		return content_type;
	}
	public void setContent_type(String contentType) {
		content_type = contentType;
	}
	
	public float getLongitude() {
		return longitude;
	}
	public void setLongitude(float longitude) {
		this.longitude = longitude;
	}
	
	public float getLatitude() {
		return latitude;
	}
	public void setLatitude(float latitude) {
		this.latitude = latitude;
	}
	
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	
	public boolean isClose_comment() {
		return close_comment;
	}
	public void setClose_comment(boolean closeComment) {
		close_comment = closeComment;
	}
	
}
