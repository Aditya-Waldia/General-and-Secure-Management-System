#include<stdio.h>
#include<map>
using namespace std;
int main(){
    map<int,string> mp;
    mp.insert({1,"apple"});
    mp[3]="graphes";
    mp[2]="kiwi";
    cout<<"value at 2= "<<mp[2];\
}