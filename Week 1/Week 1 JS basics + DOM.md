# Week 1: JS basics + DOM

### `let`

- Used to create a variable
- **Can be reassigned**
- **Block scoped**

### `const`

- Used for values that **should not be reassigned**
- **Must be assigned immediately**
- **Also block scoped**

```jsx
const pi =3.14;
pi =3.15;// ❌ ERROR

const user = {name:"Alex" }; // this is a dictionary 
user.name ="Sam";// ✅ allowed

//Why?
//Because `const` locks the **variable reference**, not the object’s contents.

```

---

### Basic operators

```jsx
+// addition
-// subtraction
*// multiplication
/   // division
%// remainder

+=  -=  *= /=  // shorthand

```

---

## `==` vs `===`

### `==` (loose equality)

- Compares **values**
- **Converts types automatically** (this is dangerous)

```jsx
5 =="5"// true 
0 ==false// true 
null ==undefined// true 

```

### `===` (strict equality)

- Compares **value AND type**
- **No type conversion**
- Always prefer this

```jsx
5 ==="5"// false
0 ===false// false
null ===undefined// false

```

 **Rule you should follow:**

> Use === 100% of the time unless you have a very specific reason not to.
> 

---

## Functions (3 types)

### 1. Function Declaration

```jsx
add(2,3);// works

functionadd(a, b) {
return a + b;
}
```

Can be used **before** it’s defined (hoisting)

### 2. Function Expression

```jsx
add(2,3);// ERROR if called before

const add =function(a, b) {
return a + b;
};
```

 **Cannot be used before definition**

### 3. Arrow Function (modern, most used)

```jsx
const add = (a, b) => {
return a + b;
};

```

Short version:

```jsx
constadd = (a, b) => a + b;

```

 Mental model:

- Arrow functions are **shorter**
- They behave slightly differently with `this`

---

## DOM = Document Object Model

![image.png](Week%201%20JS%20basics%20+%20DOM/image.png)

You can change, read, or select an object 

---

## `document.querySelector`

### What it does

> **Finds the first element** that matches a CSS selector
> 

```jsx
const button =document.querySelector(".btn");
```

### You can select by:

```jsx
"#id"
".class"
"tag"
```

Examples:

```jsx
document.querySelector("#title");
document.querySelector(".card");
document.querySelector("button");
```

🧠 Rule:

> Returns ONE element or null
> 

---

## `document.querySelectorAll`

### What it does

> Finds **ALL** matching elements
> 

```jsx
const buttons =document.querySelectorAll("button");

```

Returns a **NodeList** (array-like).

```jsx
buttons.forEach(btn => {
console.log(btn);
});

```

🧠 Rule:

> querySelectorAll → multiple
> 
> 
> `querySelector` → first only
> 

---

## `classList` (add / remove / toggle)

Classes control **styles & state**.

### `classList.add`

```jsx
element.classList.add("active");
```

### `classList.remove`

```jsx
element.classList.remove("active");

```

### `classList.toggle`

```jsx
element.classList.toggle("active");

```

🧠 `toggle` means:

- If class exists → remove it
- If not → add it

---

### Example

```jsx
const box =document.querySelector(".box");

box.classList.add("highlight");
box.classList.remove("hidden");
box.classList.toggle("active");

```

---

## `addEventListener`

### What it is

> A way to say:
> 
> 
> “When **this thing happens**, run **this function**”
> 

```jsx
element.addEventListener("click",() => {
console.log("Clicked!");
});

or 

function handleClick(){
}

element.addEventListener("click",handleclick)

```

That function is a **callback**.

- `click`
- `input` (for text fields)
- `submit` (for forms)
- `mouseover` / `mouseenter`
- `keydown` / `keyup`
- `scroll`
- `change`

---

### Full breakdown

```jsx
button.addEventListener("click",() => {
  button.classList.toggle("active");
});

```

Read it as:

> “When the button is clicked, toggle the active class.”
> 

---

## Event object

```jsx
button.addEventListener("click",(event) => {
console.log(event);
});

```

Most common thing you’ll use:

```jsx
event.target

```

```jsx
button.addEventListener("click",(e) => {
  e.target.classList.toggle("active");
});

```

---

## Putting it all together (real example)

### HTML

```html
<buttonid="toggle">Toggle</button>
<divclass="box"></div>

```

### JS

```jsx
const btn =document.querySelector("#toggle");
const box =document.querySelector(".box");

btn.addEventListener("click",() => {
  box.classList.toggle("active");
});

```

---

### `innerText`

> Returns the visible text of an element.
> 
- Respects CSS (`display: none`, `visibility: hidden`)
- Does **not** include hidden text
- Does **not** include HTML tags
- Slower (because browser must calculate layout)

**Use when:** you care about what the user actually sees.

---

### `textContent`

> Returns all plain text inside an element.
> 
- Includes hidden text
- Ignores CSS visibility
- Does **not** include HTML tags
- Faster and more predictable

**Use when:** you just want the text data (most common).

---

### `innerHTML`

> Gets or sets the HTML inside an element.
> 
- Includes HTML tags
- Can insert new elements dynamically
- Overwrites existing content
- Can be unsafe if content comes from users

**Use when:** you intentionally want to inject HTML.

---

### Tips

> Default to textContent.
> 
> 
> Use `innerHTML` only when you truly need HTML.
> 
> Use `innerText` rarely.
> 

```markdown
innerText   → visible text only
textContent → all text, visible or not
innerHTML   → text + HTML tags
```
