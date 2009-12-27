package springsprout.m31.domain;

import java.net.URL;

public class MovieVO {
    private String source;
    private String title;
    private URL thumbnailURL;
    private URL playerURL;

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public URL getThumbnailURL() {
        return thumbnailURL;
    }

    public void setThumbnailURL(URL thumbnailURL) {
        this.thumbnailURL = thumbnailURL;
    }

    public URL getPlayerURL() {
        return playerURL;
    }

    public void setPlayerURL(URL playerURL) {
        this.playerURL = playerURL;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MovieVO movieVO = (MovieVO) o;

        if (playerURL != null ? !playerURL.equals(movieVO.playerURL) : movieVO.playerURL != null) return false;
        if (source != null ? !source.equals(movieVO.source) : movieVO.source != null) return false;
        if (thumbnailURL != null ? !thumbnailURL.equals(movieVO.thumbnailURL) : movieVO.thumbnailURL != null)
            return false;
        if (title != null ? !title.equals(movieVO.title) : movieVO.title != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = source != null ? source.hashCode() : 0;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (thumbnailURL != null ? thumbnailURL.hashCode() : 0);
        result = 31 * result + (playerURL != null ? playerURL.hashCode() : 0);
        return result;
    }
}
