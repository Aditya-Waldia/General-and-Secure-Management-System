#include <iostream>
#include <vector>
using namespace std;

template<class T>
class list{
    vector<T>element;

public:
    void insert(T value) {
        element.push_back(value);
        cout << "Inserted: " << value << endl;
    }

    void remove() {
        if (element.empty()) {
            cout << "Vector is empty, nothing to remove." << endl;
            return;   
        }
        element.pop_back();
        cout << "Last element removed." << endl;
    }

    void display() {
        cout << "The elements in the list = ";
        for (auto &i : element) {
            cout << i << " ";
        }
        cout << endl;
    }
};

int main() {
    list<int> inlist;
    inlist.insert(30);
    inlist.insert(12);
    inlist.insert(55);
    inlist.remove();
    inlist.display();

    cout << endl;

    list<float> inlist2;
    inlist2.insert(2.0f);
    inlist2.insert(13.7f);
    inlist2.display();

    return 0;
}