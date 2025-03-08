function print(str_a, blnForceLTR_a, blnReverseRTL_a)
{
	api.print(str_a, blnForceLTR_a, blnReverseRTL_a);
}
function طباعة(str_a, blnForceLTR_a, blnReverseRTL_a)
{
	print(str_a, blnForceLTR_a, blnReverseRTL_a);
}
print("HELLO", false, true);
print("مرحبا");
طباعة("HELLO", false, true);
طباعة("مرحبا");