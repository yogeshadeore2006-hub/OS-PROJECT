import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a race condition in operating systems?",
    options: [
      "When two CPU cores compete for cache memory speed",
      "When multiple processes access and manipulate shared data concurrently and the final result depends on the order of execution",
      "When a process runs faster than the system clock allows",
      "A race between I/O devices and the CPU for bus bandwidth"
    ],
    correctAnswer: 1,
    explanation: "A race condition occurs when two or more processes access shared data concurrently without synchronization, leading to unpredictable and incorrect results depending on interleaving."
  },
  {
    id: 2,
    question: "Which of the following is NOT a required condition for a correct solution to the Critical-Section problem?",
    options: [
      "Mutual Exclusion",
      "Progress",
      "Bounded Waiting",
      "Preemptive Priority Scheduling"
    ],
    correctAnswer: 3,
    explanation: "The three essential requirements are Mutual Exclusion, Progress, and Bounded Waiting. Preemptive priority scheduling is a CPU scheduling policy, not a critical section requirement."
  },
  {
    id: 3,
    question: "What does a binary semaphore guarantee compared to a counting semaphore?",
    options: [
      "It allows any number of concurrent accesses up to 10",
      "Its value is restricted to 0 and 1, acting similarly to a mutex lock",
      "It is stored strictly in CPU registers rather than main memory",
      "It prevents deadlocks automatically"
    ],
    correctAnswer: 1,
    explanation: "A binary semaphore has an integer value restricted to 0 and 1. It provides mutual exclusion similar to a mutex, whereas a counting semaphore can range over an unrestricted domain."
  },
  {
    id: 4,
    question: "In the Producer-Consumer problem with a bounded buffer, what do the 'empty' and 'full' semaphores track?",
    options: [
      "CPU register utilization and memory fragmentation",
      "The number of empty slots and the number of filled slots in the shared buffer",
      "Disk I/O read and write speeds",
      "User permission levels"
    ],
    correctAnswer: 1,
    explanation: "'Empty' tracks available empty slots for producers, and 'full' tracks filled items ready for consumers to consume."
  },
  {
    id: 5,
    question: "What is deadlock?",
    options: [
      "When a process terminates unexpectedly due to segmentation fault",
      "A situation where two or more processes are permanently blocked waiting for each other to release resources",
      "When CPU utilization drops below 5%",
      "When memory swapping takes longer than disk access"
    ],
    correctAnswer: 1,
    explanation: "Deadlock occurs when every process in a set is waiting for an event that can only be caused by another process in the set, resulting in permanent standstill."
  },
  {
    id: 6,
    question: "Which classical synchronization problem involves multiple concurrent readers and writers where writers require exclusive access?",
    options: [
      "Dining Philosophers Problem",
      "Readers-Writers Problem",
      "Sleeping Barber Problem",
      "Producer-Consumer Problem"
    ],
    correctAnswer: 1,
    explanation: "The Readers-Writers problem models situations where database or file reads can happen simultaneously, but writes require exclusive write access."
  },
  {
    id: 7,
    question: "What is starvation (or indefinite blocking) in process synchronization?",
    options: [
      "When a process runs out of RAM and is killed by the OS kernel",
      "When a process is delayed indefinitely because other processes monopolize the required resource",
      "When CPU temperature exceeds safe thresholds",
      "When disk space is exhausted"
    ],
    correctAnswer: 1,
    explanation: "Starvation occurs when a process waits indefinitely within a synchronization queue because priority scheduling or unfair queue policies continually bypass it."
  },
  {
    id: 8,
    question: "What is the primary difference between a Mutex and a Binary Semaphore?",
    options: [
      "Mutexes can be acquired by multiple processes at once",
      "A Mutex has the concept of ownership (only the thread that locked it can unlock it), whereas semaphores do not enforce ownership",
      "Semaphores only work in kernel space",
      "There is no operational difference"
    ],
    correctAnswer: 1,
    explanation: "Mutex ownership means that only the locking thread is permitted to unlock the mutex, which helps prevent accidental unlocking bugs and supports priority inversion handling."
  },
  {
    id: 9,
    question: "In Peterson's Algorithm for two processes, what shared variables are used?",
    options: [
      "A counter and a stack pointer",
      "An array `turn` and a boolean array `flag`",
      "A single integer lock variable",
      "Virtual memory page tables"
    ],
    correctAnswer: 1,
    explanation: "Peterson's algorithm uses two shared variables: `int turn;` (whose turn is it?) and `boolean flag[2];` (is a process ready to enter?)."
  },
  {
    id: 10,
    question: "What does the Test-and-Set (TSL) hardware instruction provide?",
    options: [
      "An atomic way to read and modify the contents of a memory word",
      "Fast floating-point arithmetic computation",
      "Automatic garbage collection for C programs",
      "Zero-latency context switching"
    ],
    correctAnswer: 0,
    explanation: "Test-and-Set is an atomic hardware instruction that reads the old value of a memory location and sets it to true/1 simultaneously, enabling lock implementation without race conditions."
  }
];

export const CODE_SAMPLES = {
  c_mutex: `/* C POSIX Threads (pthread) Mutex Example */
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

pthread_mutex_t lock;
int shared_counter = 0;

void* increment_routine(void* arg) {
    // Entry Section: Acquire mutex lock
    pthread_mutex_lock(&lock);
    
    // Critical Section
    int temp = shared_counter;
    printf("Process %ld entering CS. Read value: %d\\n", (long)arg, temp);
    temp++;
    shared_counter = temp;
    printf("Process %ld exiting CS. New value: %d\\n", (long)arg, shared_counter);
    
    // Exit Section: Release mutex lock
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_mutex_init(&lock, NULL);

    pthread_create(&t1, NULL, increment_routine, (void*)1);
    pthread_create(&t2, NULL, increment_routine, (void*)2);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    pthread_mutex_destroy(&lock);
    printf("Final Shared Counter: %d (Expected: 2)\\n", shared_counter);
    return 0;
}`,
  c_semaphore: `/* C POSIX Semaphores Example */
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

sem_t mutex;

void* thread_func(void* arg) {
    // wait (P operation)
    sem_wait(&mutex);
    
    printf("[Thread %ld] In Critical Section...\\n", (long)arg);
    sleep(1); // simulate work
    printf("[Thread %ld] Leaving Critical Section...\\n", (long)arg);
    
    // signal (V operation)
    sem_post(&mutex);
    return NULL;
}

int main() {
    sem_init(&mutex, 0, 1); // binary semaphore init to 1
    pthread_t threads[3];

    for(long i = 0; i < 3; i++) {
        pthread_create(&threads[i], NULL, thread_func, (void*)(i + 1));
    }

    for(int i = 0; i < 3; i++) {
        pthread_join(threads[i], NULL);
    }

    sem_destroy(&mutex);
    return 0;
}`,
  producer_consumer_pseudocode: `// Producer-Consumer using Counting Semaphores & Mutex
semaphore mutex = 1;  // controls access to buffer
semaphore empty = N;  // counts empty buffer slots
semaphore full = 0;   // counts filled buffer slots

void producer() {
    while(true) {
        item = produce_item();
        
        wait(empty); // decrease empty slots
        wait(mutex); // enter critical section
        
        insert_item(buffer, item);
        
        signal(mutex); // exit critical section
        signal(full);  // increment full slots
    }
}

void consumer() {
    while(true) {
        wait(full);  // wait for filled slots
        wait(mutex); // enter critical section
        
        item = remove_item(buffer);
        
        signal(mutex); // exit critical section
        signal(empty); // increment empty slots
        
        consume_item(item);
    }
}`
};
