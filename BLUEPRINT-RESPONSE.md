Ah, I apologize! That was a UX bug on my part.

Because the Edit Service Page was built as a server component, the "Price (INR)" field had a hardcoded `disabled={true}` if the service was originally saved as "Quote Only". This meant you literally couldn't type in a new price without first saving it as un-quoted, and then reopening it.

### How I fixed it:
I have removed the `disabled` lock entirely from the price input field.
Now, you can just freely type whatever price you want in the box, uncheck "Quote Only", and hit **Save Changes** all in one go!

Try editing the price in the Admin Dashboard now — it should be completely unlocked!
