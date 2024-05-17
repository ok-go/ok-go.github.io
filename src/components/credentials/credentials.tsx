import './credentials.css'

export function Credentials(props: { withLogo: boolean }) {
  return (
    <>
      {props.withLogo ? <Logo /> : <Footer />}
    </>
  )
}

function Footer() {
  return (
    <div class='cred-footer'>
      L'Arc by Gordienko, 2024
    </div>
  )
}

function Logo() {
  return (
    <div class='cred-logo'>
      <div id='name'>L'Arc</div>
      <div id='creator'>BY GORDIENKO</div>
    </div>
  )
}
