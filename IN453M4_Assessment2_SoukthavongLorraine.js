//Random numbers for arrays
function generateRandomArray(size) {
    return Array.from({length: size}, () => Math.floor(Math.random() * 10000));
}

//Generate three datasets 
const smallDataset =generateRandomArray(10);
const mediumDataset = generateRandomArray(1000);
const largeDataset = generateRandomArray(10000);
 

//Sort 1: Bubble sort 1 function
function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        // Flag to check if any swaps were made in this pass
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements if out of order
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        // If no swaps were made in this pass, the list is already sorted
        if (!swapped) {
            break;
        }
    }

    return arr;
}

//---------------------------


//Sort 2: quick sort
function quickSort(arr) {

    if (arr.length <= 1) {
        return arr;
    } else {

        const pivot = arr[0];
        const lessThanPivot = arr.slice(1).filter(x => x <= pivot);
        const greaterThanPivot = arr.slice(1).filter(x => x > pivot);

        return [...quickSort(lessThanPivot), pivot, ...quickSort(greaterThanPivot)];
    }
}

//Sort and capture execution time
function sortAndMeasureTime(sortFunction, array) {
    const start = performance.now();
    const sortedArray = sortFunction(array);
    const end = performance.now();
    const duration = (end-start).toFixed(3);
 
    return { sortedArray, duration,};
}


//-------------Run/Display results-------------
//small dataset
const smallDatasetCopy =[...smallDataset];
console.log("Small Dataset:")
console.log('--------------')
console.log("Unsorted Small dataset:", smallDataset,'\n');

console.log("BUBBLE SORT")
const resultSm = sortAndMeasureTime(bubbleSort, smallDataset);
console.log("Sort 1 small dataset:", resultSm.sortedArray,);
console.log("Sort 1 Duration small dataset:", resultSm.duration, "ms\n");

console.log("QUICK SORT")
const resultSmOpt = sortAndMeasureTime(quickSort, smallDatasetCopy);
console.log("Sort 2 small Dataset:", resultSmOpt.sortedArray,'\n');
console.log("Sort 2 Duration small Dataset:",resultSmOpt.duration,"ms");
console.log("Duration time saved for small Dataset:",(resultSm.duration-resultSmOpt.duration).toFixed(3),"ms\n");
console.log('-------------------------------------------------------------------\n');

//medium dataset
const mediumDatasetCopy =[...mediumDataset];
console.log("Medium dataset:")
console.log('--------------')
console.log("Unsorted medium dataset:", mediumDataset,'\n');

console.log("BUBBLE SORT")
const resultMd = sortAndMeasureTime(bubbleSort, mediumDataset);
console.log("Sort 1 medium dataset:", resultMd.sortedArray);
console.log("Sort 1 Duration medium dataset:", resultMd.duration, "ms\n");

console.log("QUICK SORT")
const resultMdOpt = sortAndMeasureTime(quickSort, mediumDatasetCopy);
console.log("Sort 2 medium dataset:", resultMdOpt.sortedArray,'\n');
console.log("Sort 2 Duration medium dataset",resultMdOpt.duration,"ms");
console.log("Duration time saved medium dataset:",(resultMd.duration-resultMdOpt.duration).toFixed(3),"ms\n");
console.log('-------------------------------------------------------------------\n');


//large dataset
const largeDatasetCopy =[...largeDataset];
console.log("large dataset:")
console.log('--------------')

console.log("Unsorted large Dataset:", largeDataset,'\n');
console.log("BUBBLE SORT")
const resultLg = sortAndMeasureTime(bubbleSort, largeDataset);
console.log("Sort 1 large dataset:", resultLg.sortedArray,'\n');
console.log("Sort 1 Duration large dataset:", resultLg.duration, "ms\n");

console.log("QUICK SORT")
const resultLgOpt = sortAndMeasureTime(quickSort, largeDatasetCopy);
console.log("Sort 2 large dataset:", resultLgOpt.sortedArray,'\n');
console.log("Sort 2 duration large dataset",resultLgOpt.duration,"ms");
console.log("Duration time saved large Dataset:",(resultLg.duration-resultLgOpt.duration).toFixed(3),"ms\n");
console.log('-------------------------------------------------------------------\n');
