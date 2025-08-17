# Discussion: Future Improvements & Additional Features

## UI/UX Changes

### Main Interface

![Main Interface](./images/main-interface.png)

- **Add Year Filtering**: Allow users to filter advocates by years of experience.
- **Display Years of Experience differently**: The current display feels insufficient for user decision-making. Key questions to research: Do users prefer advocates with more experience, or is there an optimal range? Should we show experience as ranges (0-2, 3-5, 6-10+ years) rather than exact numbers? Understanding user mental models around experience would inform both the display and filtering approach.

### Specialty Filtering
![Specialty Filtering](./images/specialty-filtering.png)
- **Styling update:** I think there could have been more color contrast in here. In addition, the modal could have faded into and out of view more smoothly.
- **Refactor around selecting just one specialty:** An important design choice here was this- do users, in practice, want an advocate with more than one specialty, or is it almost always just one? If the flow was designed to select just one, I'd change this a bit
- **Synonym Search:** If the grouping didn't work here, or more categories were to be added, a search bar could be added to navigate these specialties as well, making sure each one has a list of synonym terms one would be typing instead (ex: Obsessive Compulsive Disorder would have 'OCD' as a synonym)

### Tablet/Mobile views
The current design is servicable on tablet and mobile devices, but there are opportunities for improvement in touch interactions and layout adjustments.

## Unit Testing
Had I more time, I'd have added unit tests with jest. Especially when it comes to making sure the filter logic is applying correctly.

## Code Cleanup

A few ideas could have been worth implementing with more time, like:
- **Standalone Components:** Break down large components into smaller, reusable ones (ex: The AdvocateCard component)
- **Better theme usage:** A few properties, like how long an animation transition takes in miliseconds, could have been better done by referencing some constants

## Data Management

It could have been prudent to include the text representation of locations, specialties, etc. as filterOptions provided by the backend, instead of static types on the front end.


---

*This document outlines potential improvements and features that could be implemented given additional development time and resources.*