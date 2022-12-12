class Heap<T> {
	constructor(public data: T[], public comparator: (a: T, b:T) => Boolean, public update: (a: T, val: number) => T = (x,k)=>x )
{
	this.buildHeap();
}
	heapify(i: number){
		var left = 2*i;
		var right =2*i+1;
		var minmax=i;
		if(left-1 < this.data.length) {
			if(this.comparator(this.data[left-1],this.data[minmax-1]))
			{
				minmax = left;
			}
		}
		if(right-1 < this.data.length) {
			if(this.comparator(this.data[right-1],this.data[minmax-1]))
			{
				minmax = right;
			}
		}
		if(minmax != i)
		{
			var temp = this.data[i-1];
			this.data[i-1] = this.data[minmax-1];
			this.data[minmax-1] = temp;
			this.heapify(minmax);
		}
	};
	
	buildHeap() {
		for(var i=Math.floor(this.data.length/2); i >0 ; i--)
		{
			this.heapify(i);
		}
	
	}
	
	
	toString() {
		var output = "[";
		for(var i=0; i < this.data.length; i++)
		{
			//@ts-ignore
			output += this.data[i].toString()+",";
		}
		output+="]";
		return output;
	}
	
	empty() {
		return this.data.length === 0;
	}
	
	extractTop() {
		if(this.data.length <1)
		{
			return null;
		}
		var top = this.data[0];
		this.data[0] = this.data[this.data.length-1];
		this.data.length -=1;
		this.heapify(1);
		return top;
	}
	
	insert(x: T) {
		this.data.length +=1;
		this.data[this.data.length-1] = x;
		var i = this.data.length;
		while(i > 1 && this.comparator(this.data[i-1],this.data[this.parent(i)-1]))
		{
			var temp = this.data[this.parent(i)-1];
			this.data[this.parent(i)-1] = this.data[i-1];
			this.data[i-1] = temp;
			i = this.parent(i);
		}
	}
	
	parent(i: number) {
		return Math.floor(i/2);
	}
	
	alterKey(value: number, key: T) {
		let index = this.data.indexOf(key)+1;
		// console.log(key,this.data.indexOf(key))
		// console.log("INDEX", index)
		// if(index <= 0) {
		// 	return;
		// }
		//@ts-ignore
		this.update(key, value);
		while(index > 1 && this.comparator(this.data[index-1], this.data[this.parent(index)-1]) ) {
			var temp = this.data[this.parent(index)-1];
		 	this.data[this.parent(index)-1] = this.data[index-1];
			this.data[index-1] = temp;
			index = this.parent(index);
		}
		// console.log("AFTERINDEX", index)

	}

	has(key: T) {
		return this.data.indexOf(key) !== -1;
	}
}

export default Heap;