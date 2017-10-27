package cn.edu.shou.missive.domain;
import java.util.*;
public class Main {

    //素数对
    public static void main(String[] args) {

        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int sum = 0;
        for(int i=2; i<=n/2; i++){
            if(isss(i) && isss(n-i)){
                sum++;
            }
        }
        System.out.println(sum);
    }

    //判断是否为素数
    public static boolean isss(int n){
        for(int i=2; i<=Math.sqrt(n); i++){
            if(n%i == 0)
                return false;
        }  return true;
    }

}