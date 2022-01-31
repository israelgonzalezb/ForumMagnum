import React from 'react';
import Users from '../../lib/collections/users/collection';
import { userGetDisplayName, userGetProfileUrl } from '../../lib/collections/users/helpers';
import { useNavigation } from '../../lib/routeUtil';
import { registerComponent, Components, getFragment } from '../../lib/vulcan-lib';
import { commentBodyStyles } from '../../themes/stylePiping';
import { useMessages } from '../common/withMessages';
import { useCurrentUser } from '../common/withUser';

const styles = (theme: ThemeType): JssStyles => ({
  root: {
    ...commentBodyStyles(theme),
    maxWidth: 600,
    margin: "auto"
  },
  info: {
    marginTop: 25,
    marginBottom: 25
  }
});

export const EditPaymentInfo = ({classes}: {
  classes: ClassesType,
}) => {
  const { SectionTitle, Error404 } = Components
  const currentUser = useCurrentUser()
  const { flash } = useMessages();
  const { history } = useNavigation();

  if (!currentUser) return <Error404/>
  return <div className={classes.root}>
      <SectionTitle title={`Edit Payment for ${currentUser.displayName}`}/>
      <div className={classes.info}>
        <p>To receive prizes and donations through LessWrong, you must have a valid <a href="https://paypal.com/">PayPal account</a> and to enter your associated PayPal email/info here.</p>
        <p>If you receive more than $600 in prizes in a single year, you will need to be entered into Center for Applied Rationality's (LessWrong's legal entity) payment system. CFAR will contact you via your submitted email address about next steps. (To ensure prompt payment, ensure it's an email that you check regularly)</p>
      </div>
      <Components.WrappedSmartForm
        layout="elementOnly"
        collection={Users}
        documentId={currentUser._id}
        fields={['paymentEmail', 'paymentInfo']}
        successCallback={async (user) => {
          flash(`Payment Info for "${userGetDisplayName(user)}" edited`);
          history.push(userGetProfileUrl(user));
        }}
        // cancelCallback={cancelCallback}
        showRemove={false}
        queryFragment={getFragment('UsersEdit')}
        mutationFragment={getFragment('UsersEdit')}
        submitLabel="Save"
      />
  </div>;
}

const EditPaymentInfoComponent = registerComponent('EditPaymentInfo', EditPaymentInfo, {styles});

declare global {
  interface ComponentTypes {
    EditPaymentInfo: typeof EditPaymentInfoComponent
  }
}