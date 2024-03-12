<script setup>
import { ref, computed } from 'vue';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onMounted } from 'vue';
import db from '../firebase/config'

const expenses = ref([]);
const newExpense = ref({
  item: '',
  category: '',
  amount: 0,
});
const amountInput = ref('');
const editingIndex = ref(null);


const fetchExpenses = async () => {
  const q = query(collection(db, 'expenses'), orderBy('dateTime', 'desc'));
  
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
};

onMounted(fetchExpenses);



const addOrUpdateExpense = async () => {
    if (!newExpense.value.item || !newExpense.value.category || !amountInput.value) {
        alert('Palihog pun-i ang tanang field.');
        return;
    }

    if (isNaN(parseFloat(amountInput.value))) {
        alert('Palihug pagsulod ug balido nga numero para sa kantidad.');
        return;
    }

    if (editingIndex.value === null) {
        await addExpense();
    } else {
        await updateExpense();
    }
};


const addExpense = async () => {
    const dateTime = new Date().toLocaleString();
    const expense = { ...newExpense.value, amount: parseFloat(amountInput.value), dateTime };

    try {
        const docRef = await addDoc(collection(db, 'expenses'), expense);
        console.log('Gidugang nga gasto sa ID: ', docRef.id);
    } catch (error) {
        console.error('Sayop sa pagdugang sa gasto: ', error);
    }

    newExpense.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
};


const updateExpense = async () => {
    const expenseId = expenses.value[editingIndex.value].id;
    const expense = { ...newExpense.value, amount: parseFloat(amountInput.value) };

    try {
        await updateDoc(doc(db, 'expenses', expenseId), expense);
        console.log('Gi-update ang gasto sa ID nga ', expenseId);
    } catch (error) {
        console.error('Sayop sa pag-update sa gasto: ', error);
    }

    newExpense.value = {
        item: '',
        category: '',
        amount: 0,
    };
    amountInput.value = '';
    editingIndex.value = null;
};


const deleteExpense = async (id) => {
    try {
        await deleteDoc(doc(db, 'expenses', id));
        console.log('Gasto nga adunay ID sa ', id, ' gipapas na.');
    } catch (error) {
        console.error('Sayop sa pagtangtang sa gasto ', error);
    }
};


const confirmDelete = (id) => {
    if (window.confirm('Sigurado ka ba nga gusto nimong papason kini nga gasto?')) {
        deleteExpense(id);
    }
};


const editExpense = (index) => {
    const expense = expenses.value[index];
    newExpense.value = {
        item: expense.item,
        category: expense.category,
        amount: expense.amount,
    };
    amountInput.value = expense.amount;
    editingIndex.value = index;
};

const totalExpenses = computed(() => {
    return expenses.value.reduce((total, expense) => total + parseFloat(expense.amount), 0);
});
</script>


<template>
    <div class="flex justify-center align-center min-h-screen bg-blue-100">
      <div class="container p-8 bg-blue-100 h-auto rounded-lg border w-lvw h-lvh">
        <h1 class="text-5xl text-center text-gray-800 mb-10">Pagsubay sa Gasto</h1>
        <div class="flex">
                <div class="flex-1 mr-8 max-w-lg">
                    <input type="text" v-model="newExpense.item" placeholder="Butang" class="input-field">
                    <select v-model="newExpense.category" class="input-field" id="select">
                        <option value="" disabled selected>Pilia ang kategorya</option>
                        <option value="food">Pagkaon</option>
                        <option value="clothes">Sinina</option>
                        <option value="transportation">Transportasyon</option>
                        <option value="utilities">Utilidad</option>
                        <option value="travel">Pagbiyahe</option>
                        <option value="investment">Pamuhunan</option>
                        <option value="rent">Abang</option>
                        <option value="appliances">Appliances</option>
                    </select>
                    <input type="text" v-model="amountInput" placeholder="Kantidad" class="input-field">
                    <button @click="addOrUpdateExpense" class="btn-primary">
                        Add
                    </button>

                </div>
          <div class="flex-1 relative"> 
            <div class="expenses-table-container">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="border border-slate-800 border-solid px-4 py-2">Petsa ug Oras</th>
                    <th class="border border-slate-800 px-4 py-2">Butang</th>
                    <th class="border border-slate-800 px-4 py-2">Kategorya</th>
                    <th class="border border-slate-800 px-4 py-2">Kantidad</th>
                    <th class="border px-4 py-2">Aksyon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(expense, index) in expenses" :key="index" class="text-center">
                    <td class="border border-slate-800 px-4 py-2">{{ expense.dateTime }}</td>
                    <td class="border border-slate-800 px-4 py-2">{{ expense.item }}</td>
                    <td class="border border-slate-800 px-4 py-2">{{ expense.category }}</td>
                    <td class="border border-slate-800 px-4 py-2">{{ expense.amount }}</td>
                    <td class="border px-4 py-2 flex">
                      <button @click="editExpense(index)" class="btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                      </button>
                      <button @click="confirmDelete(expense.id)" class="btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="total-expenses">Kinatibuk-ang Gasto: {{ totalExpenses }}&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  @font-face {
    font-family: 'Rubik';
    src: url('~@/assets/fonts/Rubik-Regular.ttf');
  }

  @font-face {
    font-family: 'Rubik-Light';
    src: url('~@/assets/fonts/Rubik-Light.ttf');
  }

  h1 {
    font-family:  sans-serif;
  }

    .input-field {
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      width: 100%;
      font-size: 16px;
      transition: box-shadow 0.3s ease;
    }

    #select {
      background-color: white;
    }

    .btn-primary {
      background-color: #4c7aaf;
      color: white;
      padding: 10px 20px;
      border: none;
      text-align: center;
      height: 2.8rem;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: 0.5s;
    }
  
    .btn-primary:hover {
      background-color: #2b62a1;
    }
  
    .btn-secondary {
      background-color: #7be6ce;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: 0.5s
    }
  
    .btn-secondary:hover {
      background-color: #5aceb5;
    }
  
    .btn-danger {
      background-color: #ff6357;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
  
    .btn-danger:hover {
      background-color: #ff5346;
    }
  
    .expenses-table-container {
      overflow-y: auto;
      border-radius: 5px;
    }
  
    .total-expenses {
      position: sticky;
      background-color: #dbeafe;
      padding: 10px;
      text-align: right;
      font-size: 18px;
    }

    .expenses-table-container table button {
    margin-right: 5px; 
  }

  .expenses-table-container table button:last-child {
    margin-right: 0; 
  }

  .expenses-table-container table button svg {
    vertical-align: middle; 
    margin-right: 5px;
  }
  </style>
  
  
