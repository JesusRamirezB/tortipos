# Project Log – Tortipos

This is a project I had been wanting to start for a while, but I never really had the necessity or motivation to actually do it. Eventually, both showed up, and this project became a mix of a real-world need and a learning opportunity.

## Getting started

I initially tried starting the project using **Claude**. Since it was my first time using it, I didn’t get much done and ended up using all my available credits for the day without real progress. Not fully satisfied, I switched over to **ChatGPT**, which is the AI model I’ve used the most over time.

Because I was already comfortable with it, I was able to have a much more productive discussion, not just about the project itself but also about technology choices. At that point, I was still uncertain about what stack to use. My initial idea was:

- **React.js** for the frontend  
- **Spring Boot** for the API  
- **Oracle DB** for the database  

I was also considering **Firebase** as an alternative.

We discussed the pros and cons of each option, and ChatGPT suggested additional alternatives. One of those was **Supabase**. I had heard of Supabase before but had never really used it. After going through its advantages — especially being serverless, SQL-based, and easy to integrate — it sounded like a very attractive option.

I ended up choosing:

- **React.js** for the frontend  
- **Supabase** as the backend and database  
- A **serverless approach**, since I already had some experience with SQL  

For hosting, I decided to use **Vercel**, as the project is currently intended mainly for portfolio purposes.

With these decisions made, I also got a pre-design that I genuinely liked. With that clearer direction and a defined stack, I came back the next day with a solid plan in mind and was able to work with **Claude** much more effectively.

## Initial implementation

My first request to Claude was to create the interface based on the pre-design.  
It generated:

- A single `App.jsx` file  
- Static data  
- Functional CSS  

From there, I:

- Manually corrected parts where I felt Claude misunderstood the requirements  
- Asked it to help with UI styling (styling is easily my biggest weakness)

Once I felt comfortable with the look and feel, I moved on to manually testing the interface.

## Debugging & manual fixes

During testing, I found several bugs that I fixed manually. In these cases, asking Claude actually made things worse, so I relied more on my own debugging, using the AI mostly for quick syntax or code questions.

Some of the issues included:

- Cart not scrolling correctly  
- The tortillas numpad not behaving as expected  
- Multiple issues with decimals  
  - The more decimals were entered, the more the UI would break and distort  

All of these were resolved manually.

## Database integration

Next, I designed the database using **Supabase**.

Once the tables were created, I:

- Provided Claude with the SQL used to create the database and tables  
- Asked it to adapt the project so it consumed data from Supabase instead of static data  

This part honestly surprised me — it worked on the first try. I believe the results were much better at this point because the requirements were clearer and there was a better “understanding” of the project context.

## Offline support & real-world constraints

At this point, the project was intended to be used in a real environment: **my mom’s tortillería**.

Internet connectivity there is unreliable, which led to a discussion with Claude about offline-first approaches. It suggested using a **local offline database** that would sync with Supabase whenever a connection was available.

I had no prior experience with **IndexedDB**, but Claude handled the initial setup and logic without major issues, and I integrated it into the project.

## Refactor & structure improvements

Functionality-wise, the project was basically done. The target users (my mother and her employees) don’t need complex features and aren’t very comfortable with digital systems.

However, the codebase had become very cramped.

I asked Claude to refactor the project, and it:

- Split the logic into more components  
- Introduced hooks  
- Added clearer folder structure (`hooks`, `libs`, etc.)

There were some broken imports and missing references after the refactor, which I fixed manually.

## Visual polish

Finally, I focused on visual improvements:

- Replaced emojis with actual product icon images  
- Adjusted UI spacing and consistency  

There were some path-related issues when loading images, which I also resolved manually.

## Testing infrastructure

To ensure stability, I added unit tests using **Vitest** and **Testing Library**:

- `useCart.test.js` – Tests for cart operations (add, remove, update quantity, clear)
- `useCalculator.test.js` – Tests for the tortilla calculator logic
- `offlineQueue.test.js` – Tests for IndexedDB queue operations (uses `fake-indexeddb` for mocking)

Claude helped set up the initial test configuration, but I wrote additional test cases manually to cover edge cases I encountered during debugging.

## Additional features

Some features that emerged during development:

- **Toast notifications** – Visual feedback system for sale confirmations, errors, and offline status
- **Error boundary** – Graceful error handling to prevent the app from crashing completely
- **Multi-device tracking** – Each tablet can have a unique `DEVICE_ID` to track which device made each sale
- **Cart animations** – Glow effect and auto-scroll when items are added, improving UX feedback

## Final thoughts

This project ended up being:

- A real solution to a real problem  
- A hands-on exercise in debugging, refactoring, and decision-making  
- A practical example of how I use AI tools as **assistants, not replacements**

AI helped accelerate certain parts of development, but a significant portion of the work involved manual fixes, judgment calls, and adapting the project to real-world constraints.

The project name **Tortipos** (Tortillería + POS) reflects its origin as a solution for my mom's tortillería business.
