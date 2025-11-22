#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> myList;

    myList.push_back(10);
    myList.push_back(20);
    myList.push_back(30);
    myList.push_front(5);

    cout << "List elements: ";
    for(int x : myList) {
        cout << x << " ";
    }
    cout << endl;
    myList.pop_front();  
    myList.pop_back();  

    cout << "After deletions: ";
    for(int x : myList) {
        cout << x << " ";
    }
    cout << endl;

    auto it = myList.begin();
    ++it;                 
    myList.insert(it, 15);

    cout << "After middle insertion: ";
    for(int x : myList) {
        cout << x << " ";
    }
    cout << endl;

    myList.remove(20);

    cout << "After removing value 20: ";
    for(int x : myList) {
        cout << x << " ";
    }
    cout << endl;

    return 0;
}
