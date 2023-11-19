import numpy as np
import matplotlib.pyplot as plt

class Node:
    def _init_(self, key, value):
        self.key = key
        self.value = value
        self.next = None


class LinkedList:
    def _init_(self):
        self.head = None

    def insert(self, key, value):
        new_node = Node(key, value)
        new_node.next = self.head
        self.head = new_node

    def delete(self, key):
        current = self.head
        if current and current.key == key:
            self.head = current.next
            return

        prev = None
        while current and current.key != key:
            prev = current
            current = current.next

        if current is None:
            return

        prev.next = current.next

    def increase(self, key):
        current = self.head
        while current and current.key != key:
            current = current.next

        if current:
            current.value += 1
        else:
            self.insert(key, 1)

    def find(self, key):
        current = self.head
        while current and current.key != key:
            current = current.next

        return current.value if current else None

    def list_all_keys(self):
        keys = []
        current = self.head
        while current:
            keys.append(current.key)
            current = current.next
        return keys


class TextHash:
    def _init_(self, size):
        self.size = size
        self.table = [LinkedList() for _ in range(size)]
    
    def djb2x33a_hash(self, key):
        hash_value = 5381
        for char in key:
            hash_value = (hash_value * 33 ^ ord(char)) + 33
        return hash_value % self.size
        
    def hash_function(self, key):
        # A simple hash function for strings
        hash_value = 0
        for char in key:
            hash_value = self.djb2x33a_hash(key)
        return hash_value

    def insert(self, key, value):
        hash_value = self.hash_function(key)
        self.table[hash_value].insert(key, value)

    def delete(self, key):
        hash_value = self.hash_function(key)
        self.table[hash_value].delete(key)

    def increase(self, key):
        hash_value = self.hash_function(key)
        self.table[hash_value].increase(key)

    def find(self, key):
        hash_value = self.hash_function(key)
        return self.table[hash_value].find(key)

    def list_all_keys(self):
        keys = []
        for linked_list in self.table:
            keys.extend(linked_list.list_all_keys())
        return keys


def process_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
        words = text.split()
        return words


def generate_histogram(hash_table):
    histogram = [len(linked_list.list_all_keys()) for linked_list in hash_table.table]
    return histogram


def main():
    m_values = [30, 300, 1000]

    for m in m_values:
        hash_table = TextHash(m)
        
        words = process_text("alice.txt")

        for word in words:
            if hash_table.find(word) is None:
                hash_table.insert(word, 1)
            else:
                hash_table.increase(word)
        hash_table.increase("Algorithms")
        # Output file for each m value
        output_file_path = f"output_m_{m}.txt"

        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            # Write header
            output_file.write("Word\tCount\n")

            # Write word counts
            for key in hash_table.list_all_keys():
                count = hash_table.find(key)
                output_file.write(f"{key}\t{count}\n")

        print(f"Output written to {output_file_path}")
        
        
    for m in m_values:
        hash_table = TextHash(m)
        words = process_text("./alice.txt")

        for word in words:
            if hash_table.find(word) is None:
                hash_table.insert(word, 1)
            else:
                hash_table.increase(word)

        histogram = generate_histogram(hash_table)

        # Plot histogram
        plt.figure(figsize=(10, 6))
        plt.bar(range(m), histogram, color='blue', alpha=0.7)
        plt.title(f"Histogram for m = {m}")
        plt.xlabel("Collision Lists")
        plt.ylabel("List Length")
        plt.show()

        variance = np.var(histogram)
        print(f"Variance for m = {m}: {variance}")

        sorted_histogram = sorted(enumerate(histogram), key=lambda x: x[1], reverse=True)
        top_10_percent = sorted_histogram[:int(0.1 * m)]

        print("\nTop 10% of collision lists:")
        for index, length in top_10_percent:
            print(f"List {index + 1}: Length = {length}")

        print("\n------------------------")

if __name__ == "_main_":
    main()