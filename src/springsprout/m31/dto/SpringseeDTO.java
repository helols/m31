/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2009. 12. 21
 * Time: 오후 9:40:35
 * enjoy springsprout ! development!
 */
package springsprout.m31.dto;

public class SpringseeDTO {
    private String link;
    private String thumbnail;
    private String width;
    private String height;
    private String title;
    private String image;

    public SpringseeDTO(String thumbnail, String width, String height, String title, String link, String image) {
        this.thumbnail = thumbnail;
        this.width = width;
        this.height = height;
        this.title = title;
        this.link = link;
        this.image = image;
    }

    public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }
}
