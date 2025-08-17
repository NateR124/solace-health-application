# What I'd change with more time

Hello, Solace Health! Thanks for considering my candidacy. I spent more time than requested on this assignment, but still cut myself short before I'd done everything possible.

Anyways, here's a list of things I'd have done with more time. Let me know if you have any questions - thanks!

## UI/UX Changes

A big theme with my UI/UX changes, would be understanding your business better- both regarding your users, as well as your business goals.

### Main Interface

![Main Interface](./images/main-interface.png)

- **Add Year Filtering**: Allow users to filter advocates by years of experience.
- **Display Years of Experience differently**: I was unsatisfied with how it looks here. With regard to filtering and to displaying, I'd really want to know how users should be considering years of experience- is it always better? Is having years about a certain threshold important? How would we like them to use years of experience? I feel like you could bias your user into over or under emphasizing years of experience, depending on how you present it.

### Specialty Filtering

![Specialty Filtering](./images/specialty-filtering.png)

- **Styling update:** I think there could have been more color contrast in here. In addition, the modal could have faded into and out of view more smoothly.

- **Refactor around selecting just one specialty:** An important design choice here was this- do users, in practice, want an advocate with more than one specialty, or is it almost always just one? If the flow was designed to select just one, I'd change this a bit
- **Synonym Search:** If the grouping didn't work here, or more categories were to be added, a search bar could be added to navigate these specialties as well, making sure each one has a list of synonym terms one would be typing instead (ex: Obsessive Compulsive Disorder would have 'OCD' as a synonym)

### Tablet/Mobile views

The current design is servicable on tablet and mobile devices, but there are opportunities for improvement in touch interactions and layout adjustments.

## Unit Testing

Had I more time, I'd have added unit tests with jest. Especially to ensure the filter logic is applying correctly.

## Code Cleanup

A few ideas could have been worth implementing with more time, like:

- **Standalone Components:** Break down large components into smaller, reusable ones (ex: The AdvocateCard component)
- **Better theme usage:** A few properties, like how long an animation transition takes in miliseconds, could have been better done by referencing some constants

## Data Management

It could have been prudent to include the text representation of locations, specialties, etc. as filterOptions provided by the backend, instead of static types on the front end.


---

*This document outlines potential improvements and features that could be implemented given additional development time and resources.*