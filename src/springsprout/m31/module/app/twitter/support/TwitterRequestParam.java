package springsprout.m31.module.app.twitter.support;

public class TwitterRequestParam {
	private int pageno = 1;
	private int count = 100;

	public int getPageno() {
		return pageno;
	}

	public void setPageno(int pageno) {
		this.pageno = pageno;
	}
	
	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}
	
}
