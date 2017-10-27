package cn.edu.shou.missive.domain.missiveDataForm;

import cn.edu.shou.missive.domain.BaseEntity;

/**
 * Created by DELL on 2017/8/15.
 */
public class DisasterWarningForm extends BaseEntity{
    public String type;
    public String introduction;
    public String imgurl;
    public String dataurl;
    public String getType(){
        return type;
    }
    public void setType(String type){
        this.type=type;
    }
    public String getIntroduction(){
        return introduction;
    }
    public void setIntroduction(String introduction){
        this.introduction=introduction;
    }

    public String getImgurl() {
        return imgurl;
    }

    public void setImgurl(String imgurl) {
        this.imgurl = imgurl;
    }

    public String getDataurl() {
        return dataurl;
    }

    public void setDataurl(String dataurl) {
        this.dataurl = dataurl;
    }

}
