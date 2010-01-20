/**
 * Created by IntelliJ IDEA.
 * User: helols
 * Date: 2010. 1. 1
 * Time: 오후 3:04:31
 * enjoy springsprout ! development!
 */
package springsprout.m31.module.member;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.encoding.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import springsprout.m31.domain.DeskTopAdditionInfo;
import springsprout.m31.domain.FinderFile;
import springsprout.m31.domain.ThingVO;
import springsprout.m31.dto.SignupDTO;
import springsprout.m31.module.app.finder.FinderRepository;
import springsprout.m31.module.app.timelog.TimeLogRepository;
import springsprout.m31.utils.MD5Util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import static springsprout.m31.common.M31System.AVATAR_URL;

@Service
@Transactional
public class MemberService {

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    FinderRepository finderRepository;

    @Autowired
    TimeLogRepository timeLogRepository;

    /**
     * 가입 프로세스.
     *
     * @param signupDTO
     * @return
     */
    public Boolean signup(SignupDTO signupDTO) {
        signupDTO.setJ_password(passwordEncoder.encodePassword(signupDTO.getJ_password(), null));
        Integer memberId = memberRepository.signup(signupDTO);
        if (memberId > 0) {
            DeskTopAdditionInfo deskTopAdditionInfo = new DeskTopAdditionInfo();
            deskTopAdditionInfo.setMemberId(memberId);
            deskTopAdditionInfo.setDeskTopThemeId("vistaglass");
            deskTopAdditionInfo.setDeskTopBKImgRepeat("nr");
            deskTopAdditionInfo.setDeskTopBKcolor("#FFF");
            deskTopAdditionInfo.setDeskTopBKImgSrc("../../images/desktop/wallpapers/springsprout-disit.jpg");
            deskTopAdditionInfo.setDeskTopBKImgPosition("tc");
            memberRepository.initDesktopAdditon(deskTopAdditionInfo);

            makeDefaultFolder(memberId);
            makeDefaultThing(memberId);
            memberRepository.insertRole(memberId);
            return memberRepository.installApp(memberId) > 0 ? true : false;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public Boolean isDuplicated(String email) {
        return memberRepository.getMemberByEmail(email) != null ? true : false;
    }

    public List<HashMap<String, String>> makeMemberInfo(String users) {
        List<HashMap<String, String>> userList = memberRepository.makeMemberInfo(Arrays.asList(users.split(";")));
        for (HashMap<String, String> userInfo : userList) {
            userInfo.put("IMGSRC", AVATAR_URL + MD5Util.md5Hex(userInfo.get("EMAIL")) + "?r=x&s=256");
        }
        return userList;
    }

    private void makeDefaultFolder(Integer memberId) {
        List<FinderFile> defaultFolderList = new ArrayList<FinderFile>();
        FinderFile docFolder = new FinderFile();
        docFolder.setMemberId(memberId);
        docFolder.setFileName("봄 문서");
        docFolder.setParentId(1);
        docFolder.setFileType("F");
        docFolder.setFileAddition("");
        docFolder.setDefaultYn("Y");
        docFolder.setLinkAppId("springdoc");
        docFolder.setIconCls("folder");

        FinderFile imgFolder = new FinderFile();
        imgFolder.setMemberId(memberId);
        imgFolder.setFileName("봄 그림");
        imgFolder.setParentId(1);
        imgFolder.setFileType("F");
        imgFolder.setFileAddition("");
        imgFolder.setDefaultYn("Y");
        imgFolder.setLinkAppId("springsee");
        imgFolder.setIconCls("folder");

        FinderFile flashFolder = new FinderFile();
        flashFolder.setMemberId(memberId);
        flashFolder.setFileName("봄 동영상");
        flashFolder.setParentId(1);
        flashFolder.setFileType("F");
        flashFolder.setFileAddition("");
        flashFolder.setDefaultYn("Y");
        flashFolder.setLinkAppId("springplayer");
        flashFolder.setIconCls("folder");


        FinderFile bookFolder = new FinderFile();
        bookFolder.setMemberId(memberId);
        bookFolder.setFileName("봄 북");
        bookFolder.setParentId(1);
        bookFolder.setFileType("F");
        bookFolder.setFileAddition("");
        bookFolder.setDefaultYn("Y");
        bookFolder.setLinkAppId("springdoc");
        bookFolder.setIconCls("folder");

        defaultFolderList.add(docFolder);
        defaultFolderList.add(imgFolder);
        defaultFolderList.add(flashFolder);
        defaultFolderList.add(bookFolder);
        Integer bookFileId = 0;
        for (FinderFile finderFile : defaultFolderList) {
            bookFileId = finderRepository.insertFile(finderFile);
        }

        FinderFile seeBookFolder = new FinderFile();
        seeBookFolder.setMemberId(memberId);
        seeBookFolder.setFileName("볼 책");
        seeBookFolder.setParentId(bookFileId);
        seeBookFolder.setFileType("F");
        seeBookFolder.setFileAddition("");
        seeBookFolder.setDefaultYn("N");
        seeBookFolder.setLinkAppId("springbook");
        seeBookFolder.setIconCls("folder");

        FinderFile sawBookFile = new FinderFile();
        sawBookFile.setMemberId(memberId);
        sawBookFile.setFileName("본 책");
        sawBookFile.setParentId(bookFileId);
        sawBookFile.setFileType("F");
        sawBookFile.setFileAddition("");
        sawBookFile.setDefaultYn("N");
        sawBookFile.setLinkAppId("springbook");
        sawBookFile.setIconCls("folder");

        FinderFile buyFile = new FinderFile();
        buyFile.setMemberId(memberId);
        buyFile.setFileName("살 책");
        buyFile.setParentId(bookFileId);
        buyFile.setFileType("F");
        buyFile.setFileAddition("");
        buyFile.setDefaultYn("N");
        buyFile.setLinkAppId("springbook");
        buyFile.setIconCls("folder");

        defaultFolderList.clear();

        defaultFolderList.add(seeBookFolder);
        defaultFolderList.add(sawBookFile);
        defaultFolderList.add(buyFile);

        for (FinderFile finderFile : defaultFolderList) {
            finderRepository.insertFile(finderFile);
        }
    }

    private void makeDefaultThing(Integer memberId) {
        ThingVO study = new ThingVO();
        ThingVO work = new ThingVO();
        ThingVO goToilet = new ThingVO();
        ThingVO coding = new ThingVO();
        ThingVO eat = new ThingVO();
        ThingVO end = new ThingVO();

        study.setMemberID(memberId);
        study.setThing("공부");
        study.setViewOrder(0);
        timeLogRepository.addThing(study);

        work.setMemberID(memberId);
        work.setThing("회사일");
        work.setViewOrder(0);
        timeLogRepository.addThing(work);

        goToilet.setMemberID(memberId);
        goToilet.setThing("화장실");
        goToilet.setViewOrder(0);
        timeLogRepository.addThing(goToilet);

        coding.setMemberID(memberId);
        coding.setThing("코딩");
        coding.setViewOrder(0);
        timeLogRepository.addThing(coding);

        eat.setMemberID(memberId);
        eat.setThing("식사");
        eat.setViewOrder(0);
        timeLogRepository.addThing(eat);

        end.setMemberID(memberId);
        end.setThing("연아짱");
        end.setViewOrder(-2);
        timeLogRepository.addThing(end);


    }
}
