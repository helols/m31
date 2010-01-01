package springsprout.m31.dto;

import springsprout.m31.domain.enums.OpenApi;

public class SpringPlayerCri {
    private int start;
    private int limit;
    private String q;
    private OpenApi type;

    public OpenApi getType() {
        return type;
    }

    public void setType(OpenApi type) {
        this.type = type;
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

    public String getQ() {
        return q;
    }

    public void setQ(String q) {
        this.q = q;
    }

    @Override
    public String toString() {
        return "SpringPlayerCri{" +
                "start=" + start +
                ", limit=" + limit +
                ", q='" + q + '\'' +
                ", type=" + type +
                '}';
    }
}
