package springsprout.m31.domain;

import java.net.URL;

public class MovieVO {
    private String source;
    private String title;
    private String thumbnailURL;
    private String playerURL;
    private String author;
    private int duration;

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

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

    public String getThumbnailURL() {
        return thumbnailURL;
    }

    public void setThumbnailURL(String thumbnailURL) {
        this.thumbnailURL = thumbnailURL;
    }

    public String getPlayerURL() {
        return playerURL;
    }

    public void setPlayerURL(String playerURL) {
        this.playerURL = playerURL;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MovieVO movieVO = (MovieVO) o;

        if (duration != movieVO.duration) return false;
        if (author != null ? !author.equals(movieVO.author) : movieVO.author != null) return false;
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
        result = 31 * result + (author != null ? author.hashCode() : 0);
        result = 31 * result + duration;
        return result;
    }

    @Override
    public String toString() {
        return "MovieVO{" +
                "source='" + source + '\'' +
                ", title='" + title + '\'' +
                ", thumbnailURL=" + thumbnailURL +
                ", playerURL=" + playerURL +
                ", author='" + author + '\'' +
                ", duration='" + duration + '\'' +
                '}';
    }
}
